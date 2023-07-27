import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { DocumentDTO } from './dto/DocumentDTO';
import { UpdateDocumentDTO } from './dto/updateDocumentDTO';

import { Op, ValidationError } from 'sequelize';
import errors from 'src/utils/errors';
import fetch from 'node-fetch';

import { Document } from './document.model';
import { DocumentRoute } from 'src/documentRoute/documentRoute.model';
import { DocumentType } from 'src/documentType/documentType.model';
import { DocumentOrderLog } from 'src/documentOrderLog/documentOrderLog.model';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document)
    private readonly documentRepository: typeof Document,
    @InjectModel(DocumentRoute)
    private readonly documentRouteRepository: typeof DocumentRoute,
    @InjectModel(DocumentType)
    private readonly documentTypeRepository: typeof DocumentType,
    @InjectModel(DocumentOrderLog)
    private readonly documentOrderLogRepository: typeof DocumentOrderLog,
  ) {}

  async getAllDocument(req, res) {
    try {
      const filter = { ...req.filter };

      filter.where = {
        ...filter.where,
        flagDeleted: {
          [Op.eq]: null,
        },
      };

      if (req.query.officeId)
        filter.where.officeId = {
          [Op.eq]: req.query.officeId,
        };

      if (req.query.fullname)
        filter.where.usernames = {
          [Op.iLike]: `%${req.query.fullname}%`,
        };

      if (req.query.authorFullname) {
        const fieldKey = /\d/.test(req.query.authorFullname)
          ? 'registrationNumber'
          : 'authorFullname';

        filter.where[fieldKey] = {
          [Op.iLike]: `%${req.query.authorFullname}%`,
        };
      }

      if (req.query.myDocumentsFlag && req.query.myDocumentsFlag === 'true') {
        const ids = req.user.roles.map((r) => r.idOffice);
        ids.push(req.user.officeId);

        filter.where.officeId = {
          [Op.in]: ids,
        };

        filter.where.permitionCurrent = {
          [Op.in]: req.user.roles.map((r) => r.idAccessCode),
        };

        filter.where.statusId = {
          [Op.eq]: 3,
        };
      }

      if (req.query.modelDate) {
        if (req.query.modelDate.length === 10) {
          filter.where.dateApplication = {
            [Op.eq]: new Date(req.query.modelDate),
          };
        } else {
          const modelDate = JSON.parse(req.query.modelDate);
          filter.where.dateApplication = {
            [Op.gte]: new Date(modelDate.from),
            [Op.lte]: new Date(modelDate.to),
          };
        }
      }

      const isSecretary = req.user.roles.some((r) =>
        [
          'SDM_SECRETARY_CHECK',
          'SDM_SECRETARY_REGISTRATION',
          'SDM_LABOR_CHECK',
          'SDM_LABOR_REGISTRATION',
        ].includes(r.idAccessCode),
      );

      const usersFromArm = await fetch(
        'http://10.11.62.74/uemi_new/frontend/web/index.php?r=api/personnel/get-functional-submission',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${req.token}`,
          },
          body: JSON.stringify({
            employee_number: `${req.user.id}`,
          }),
        },
      ).then((response) => response.json());

      const isAdmin = req.user.roles.some(
        (r) => r.idAccessCode === 'UEMI_ADMIN',
      );

      if (!isAdmin && isSecretary && !req.query.officeId) {
        const arr = req.user.roles
          .filter((x) => x.idAccessCode.includes('SDM'))
          .map((l) => l.idOffice);
        arr.push(req.user.officeId);
        const newArr = arr.filter((item, pos) => arr.indexOf(item) === pos);
        filter.where.officeId = {
          [Op.in]: newArr,
        };
      }

      if (!isAdmin && !isSecretary) {
        filter.where.authorPersonalNumber = {
          [Op.eq]: req.user.id,
        };

        filter.where[Op.or] = [
          { authorPersonalNumber: req.user.id },
          {
            users: {
              [Op.or]: usersFromArm.map((en) => ({
                [Op.contains]: [{ employeeNumber: en }],
              })),
            },
          },
        ];
      }

      const documents = await this.documentRepository.findAll({
        ...filter,
        include: [{ all: true, nested: true, duplicating: true }],
        limit: 100,
      });

      return res.status(errors.success.code).json(documents);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getDocumentById(req, res) {
    try {
      const documentId = req.params.documentId;
      const document = await this.documentRepository.findByPk(documentId, {
        include: { all: true, nested: true },
      });

      if (!document)
        return res
          .status(errors.notFound.code)
          .json({ message: 'Документ не найден' });

      const route = await this.documentRouteRepository.findOne({
        where: {
          orderId: document.order,
          documentType: document.documentType,
        },
        include: { all: true, nested: true },
      });

      return res.status(errors.success.code).json({ document, route });
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocument(req, res) {
    try {
      const { documentType, body, dateApplication, documentTemplateID, users } =
        req.body;

      const { id: userId, fullname, officeName, officeId } = req.user;

      const [route, type] = await Promise.all([
        this.documentRouteRepository.findOne({
          where: {
            orderId: 1,
            documentType,
          },
        }),
        this.documentTypeRepository.findOne({
          where: {
            id: documentType,
          },
        }),
      ]);

      if (!route) {
        return res
          .status(errors.notFound.code)
          .json({ message: 'Документ не найден' });
      }

      if (!type) {
        return res
          .status(errors.notFound.code)
          .json({ message: 'Тип документа не найден' });
      }

      const usernames = users.map((u) => u.fullname).join();

      const document = await this.documentRepository.create({
        body,
        documentType: type.id,
        documentTypeDescription: type.description,
        authorPersonalNumber: userId,
        authorFullname: fullname,
        dateApplication,
        statusId: 3,
        order: 1,
        permitionCurrent: route.permition,
        permitionCurrentDesc: route.description,
        documentTemplateID,
        users,
        usernames,
        officeName,
        officeId,
      });

      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.warn(e);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocumentInDraft(req, res) {
    try {
      const { documentType, body, dateApplication, documentTemplateID, users } =
        req.body;

      const { id: userId, fullname, officeName, officeId } = req.user;

      const [route, type] = await Promise.all([
        this.documentRouteRepository.findOne({
          where: {
            orderId: 1,
            documentType,
          },
        }),

        this.documentTypeRepository.findOne({
          where: {
            id: documentType,
          },
        }),
      ]);

      if (!route || !type) return res.sendStatus(errors.notFound.code);

      const document = await this.documentRepository.create({
        body,
        documentType: type.id,
        documentTypeDescription: type.description,
        authorPersonalNumber: userId,
        authorFullname: fullname,
        dateApplication,
        statusId: 1,
        order: 1,
        permitionCurrent: route.permition,
        permitionCurrentDesc: route.description,
        documentTemplateID,
        users,
        usernames: users ? users.map((u) => u.fullname).join(' ') : '',
        officeName,
        officeId,
      });

      const routeNext = await this.documentRouteRepository.findOne({
        where: {
          orderId: 1,
          documentType: document.documentType,
        },
      });

      const documentOrderLogData = {
        documentId: document.id,
        order: document.order,
        orderDescription: routeNext.description,
        statusDescription: 'Черновик',
        personalNumber: userId,
        fullname,
      };

      await this.documentOrderLogRepository.bulkCreate([documentOrderLogData]);

      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.warn(e);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentByDocumentId(req, res) {
    try {
      const document = await this.documentRepository.findByPk(
        req.params.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      if (!document)
        return res
          .status(errors.notFound.code)
          .json({ message: 'Не найден документ' });

      await document.update({
        dateApplication: req.body.dateApplication,
        body: req.body.updatedDocument,
        users: req.body.users,
        officeName: req.user.officeName,
        officeId: req.user.officeId,
      });

      const route = await this.documentRouteRepository.findOne({
        where: {
          orderId: document.order,
          documentType: document.documentType,
        },
        include: [{ all: true, nested: true, duplicating: true }],
      });

      if (!route)
        return res
          .sendStatus(errors.forbidden.code)
          .send('Не найден DocumentRoute');

      let routeNext;
      if (!req.user.roles.map((r) => r.idAccessCode).includes(route.permition))
        return res.sendStatus(errors.forbidden.code);

      if (document.statusId == 3 && req.body.agree) {
        if (document.order == 3) {
          await document.update({
            registrationNumber: req.body.registrationNumber,
          });
        }

        if (document.order < 4) {
          const orderNext = document.order + 1;
          routeNext = await this.documentRouteRepository.findOne({
            where: {
              orderId: orderNext,
              documentType: document.documentType,
            },
          });

          await document.update({
            order: orderNext,
            permitionCurrent: routeNext.permition,
            permitionCurrentDesc: routeNext.description,
          });
        } else {
          await document.increment('statusId', { by: 1 });
          routeNext = await this.documentRouteRepository.findOne({
            where: {
              orderId: 4,
              documentType: document.documentType,
            },
          });

          if (!routeNext) return res.sendStatus(errors.notFound.code);
        }
      } else if (document.statusId == 3 && !req.body.agree) {
        routeNext = await this.documentRouteRepository.findOne({
          where: {
            orderId: 1,
            documentType: document.documentType,
          },
        });

        if (!routeNext) return res.sendStatus(errors.notFound.code);

        await document.update({
          statusId: 2,
          order: 1,
          permitionCurrent: routeNext.permition,
          permitionCurrentDesc: routeNext.description,
          message: req.body.message,
          messageUserId: req.user.id,
          messageUserFullname: req.user.fullname,
        });
      }

      if (!routeNext) return res.sendStatus(errors.notFound.code);

      const documentNew = await this.documentRepository.findByPk(
        req.params.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      await this.documentOrderLogRepository.create({
        documentId: documentNew.id,
        order: documentNew.order,
        orderDescription: routeNext.description,
        statusDescription: documentNew.status.description,
        personalNumber: req.user.id,
        fullname: req.user.fullname,
        message: req.body.message,
        registrationNumber: req.body.registrationNumber,
      });

      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.log(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentInfoForRole(req, res) {
    try {
      const document = await this.documentRepository.findByPk(
        req.params.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      if (!document) return res.sendStatus(errors.notFound.code);

      await document.update({
        dateApplication: req.body.dateApplication,
        body: req.body.updatedDocument,
        users: req.body.users,
        officeName: req.user.officeName,
        officeId: req.user.officeId,
      });

      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.log(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentFromDraftAndRevisionByDocumentId(req, res) {
    try {
      const document = await this.documentRepository.findByPk(
        req.params.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      if (!document) return res.sendStatus(errors.notFound.code);

      const route = await this.documentRouteRepository.findOne({
        where: {
          orderId: 1,
          documentType: req.body.documentType,
        },
      });

      if (!route) return res.sendStatus(errors.notFound.code);

      if (
        req.user.id == document.authorPersonalNumber &&
        !req.body.flagUpdateDraft
      ) {
        await document.update({
          body: req.body.updatedDocument,
          statusId: 3,
          order: 1,
          permitionCurrent: route.permition,
          permitionCurrentDesc: route.description,
          dateApplication: req.body.dateApplication,
          documentTemplateID: req.body.documentTemplateID,
          users: req.body.users,
          officeName: req.user.officeName,
          officeId: req.user.officeId,
          documentType: req.body.documentType,
        });

        const documentUpdated = await this.documentRepository.findByPk(
          req.params.documentId,
          {
            include: [{ all: true, nested: true, duplicating: true }],
          },
        );

        const routeNext = await this.documentRouteRepository.findOne({
          where: {
            orderId: 1,
            documentType: document.documentType,
          },
        });

        await DocumentOrderLog.create({
          documentId: documentUpdated.id,
          order: documentUpdated.order,
          orderDescription: routeNext.description,
          statusDescription: documentUpdated.status.description,
          personalNumber: req.user.id,
          fullname: req.user.fullname,
        });
      }

      if (req.body.flagUpdateDraft) {
        await document.update({
          body: req.body.updatedDocument,
          permitionCurrent: route.permition,
          permitionCurrentDesc: route.description,
          dateApplication: req.body.dateApplication,
          documentTemplateID: req.body.documentTemplateID,
          users: req.body.users,
          officeName: req.user.officeName,
          officeId: req.user.officeId,
          documentType: req.body.documentType,
        });
      }

      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.log(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentFlagDeleted(req, res) {
    try {
      const document = await this.documentRepository.findByPk(
        req.params.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      if (!document) return res.sendStatus(errors.notFound.code);

      await document.update({
        dateApplication: req.body.dateApplication,
        deletedDate: new Date(Date.now()),
        flagDeleted: true,
        deletedAuthorFullname: req.body.deletedAuthorFullname,
        deletedAuthorPersonalNumber: req.body.deletedAuthorPersonalNumber,
      });

      return res.status(errors.success.code).json(document);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async deleteAllDocuments(res) {
    try {
      this.documentRepository.destroy({
        where: {},
      });

      return res.status(errors.success.code).json('deleted all');
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}

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

  async getAllDocument(filter, query, user, res) {
    try {
      filter.where = {
        ...filter.where,
        flagDeleted: {
          [Op.eq]: null,
        },
      };

      if (query.officeId)
        filter.where.officeId = {
          [Op.eq]: query.officeId,
        };

      if (query.fullname)
        filter.where.usernames = {
          [Op.iLike]: `%${query.fullname}%`,
        };

      if (query.authorFullname) {
        const fieldKey = /\d/.test(query.authorFullname)
          ? 'registrationNumber'
          : 'authorFullname';

        filter.where[fieldKey] = {
          [Op.iLike]: `%${query.authorFullname}%`,
        };
      }

      if (query.myDocumentsFlag && query.myDocumentsFlag === 'true') {
        const ids = user.roles.map((r) => r.idOffice);
        ids.push(user.officeId);

        filter.where.officeId = {
          [Op.in]: ids,
        };

        filter.where.permitionCurrent = {
          [Op.in]: user.roles.map((r) => r.idAccessCode),
        };

        filter.where.statusId = {
          [Op.eq]: 3,
        };
      }

      if (query.modelDate) {
        if (query.modelDate.length === 10) {
          filter.where.dateApplication = {
            [Op.eq]: new Date(query.modelDate),
          };
        } else {
          const modelDate = JSON.parse(query.modelDate);
          filter.where.dateApplication = {
            [Op.gte]: new Date(modelDate.from),
            [Op.lte]: new Date(modelDate.to),
          };
        }
      }

      const isSecretary = user.roles.some((r) =>
        [
          'SDM_SECRETARY_CHECK',
          'SDM_SECRETARY_REGISTRATION',
          'SDM_LABOR_CHECK',
          'SDM_LABOR_REGISTRATION',
        ].includes(r.idAccessCode),
      );

      const usersFromArm = Object.keys(
        await (
          await fetch(
            'http://10.11.62.74/uemi_new/frontend/web/index.php?r=api/personnel/get-functional-submission',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                employee_number: `${user.id}`,
              }),
            },
          )
        ).json(),
      ).map((x) => Number(x));

      const isAdmin = user.roles.some((r) => r.idAccessCode === 'UEMI_ADMIN');

      if (!isAdmin && isSecretary && !query.officeId) {
        const arr = user.roles
          .filter((x) => x.idAccessCode.includes('SDM'))
          .map((l) => l.idOffice);
        arr.push(user.officeId);
        const newArr = arr.filter((item, pos) => arr.indexOf(item) === pos);
        filter.where.officeId = {
          [Op.in]: newArr,
        };
      }

      if (!isAdmin && !isSecretary) {
        filter.where.authorPersonalNumber = {
          [Op.eq]: user.id,
        };

        filter.where[Op.or] = [
          { authorPersonalNumber: user.id },
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

      return res.json(documents);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getDocumentById(param, res) {
    try {
      const documentId = param.documentId;
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

  async addNewDocument(user, body, res) {
    try {
      const [route, type] = await Promise.all([
        this.documentRouteRepository.findOne({
          where: {
            orderId: 1,
            documentType: body.documentType,
          },
        }),
        this.documentTypeRepository.findOne({
          where: {
            id: body.documentType,
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

      const document = await this.documentRepository.create({
        body: body.body,
        documentType: type.id,
        documentTypeDescription: type.description,
        authorPersonalNumber: user.userId,
        authorFullname: user.fullname,
        dateApplication: body.dateApplication,
        statusId: 3,
        order: 1,
        permitionCurrent: route.permition,
        permitionCurrentDesc: route.description,
        documentTemplateID: body.documentTemplateID,
        users: body.users,
        usernames: body.users.map((u) => u.fullname).join(),
        officeName: body.officeName,
        officeId: body.officeId,
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

  async addNewDocumentInDraft(user, body, res) {
    try {
      const [route, type] = await Promise.all([
        this.documentRouteRepository.findOne({
          where: {
            orderId: 1,
            documentType: body.documentType,
          },
        }),

        this.documentTypeRepository.findOne({
          where: {
            id: body.documentType,
          },
        }),
      ]);

      if (!route || !type) return res.sendStatus(errors.notFound.code);

      const document = await this.documentRepository.create({
        body: body.body,
        documentType: type.id,
        documentTypeDescription: type.description,
        authorPersonalNumber: user.id,
        authorFullname: user.fullname,
        dateApplication: body.dateApplication,
        statusId: 1,
        order: 1,
        permitionCurrent: route.dataValues.permition,
        permitionCurrentDesc: route.dataValues.description,
        documentTemplateID: body.documentTemplateID,
        users: body.users,
        usernames: body.users
          ? body.users.map((u) => u.fullname).join(' ')
          : '',
        officeName: body.officeName,
        officeId: body.officeId,
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
        personalNumber: user.id,
        fullname: user.fullname,
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

  async updateDocumentByDocumentId(user, body, param, res) {
    try {
      const document = await this.documentRepository.findByPk(
        param.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      if (!document)
        return res
          .status(errors.notFound.code)
          .json({ message: 'Не найден документ' });

      await document.update({
        dateApplication: body.dateApplication,
        body: body.updatedDocument,
        users: body.users,
        officeName: user.officeName,
        officeId: user.officeId,
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
      if (!user.roles.map((r) => r.idAccessCode).includes(route.permition))
        return res.sendStatus(errors.forbidden.code);

      if (document.statusId == 3 && body.agree) {
        if (document.order == 3) {
          await document.update({
            registrationNumber: body.registrationNumber,
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
      } else if (document.statusId == 3 && !body.agree) {
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
          message: body.message,
          messageUserId: user.id,
          messageUserFullname: user.fullname,
        });
      }

      if (!routeNext) return res.sendStatus(errors.notFound.code);

      const documentNew = await this.documentRepository.findByPk(
        param.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      await this.documentOrderLogRepository.create({
        documentId: documentNew.id,
        order: documentNew.order,
        orderDescription: routeNext.description,
        statusDescription: documentNew.status.description,
        personalNumber: user.id,
        fullname: user.fullname,
        message: body.message,
        registrationNumber: body.registrationNumber,
      });

      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.log(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentInfoForRole(user, param, body, res) {
    try {
      const document = await this.documentRepository.findByPk(
        param.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      if (!document) return res.sendStatus(errors.notFound.code);

      await document.update({
        dateApplication: body.dateApplication,
        body: body.updatedDocument,
        users: body.users,
        officeName: user.officeName,
        officeId: user.officeId,
      });

      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.log(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentFromDraftAndRevisionByDocumentId(user, body, param, res) {
    try {
      const document = await this.documentRepository.findByPk(
        param.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      if (!document) return res.sendStatus(errors.notFound.code);

      const route = await this.documentRouteRepository.findOne({
        where: {
          orderId: 1,
          documentType: body.documentType,
        },
      });

      if (!route) return res.sendStatus(errors.notFound.code);

      if (user.id == document.authorPersonalNumber && !body.flagUpdateDraft) {
        await document.update({
          body: body.updatedDocument,
          statusId: 3,
          order: 1,
          permitionCurrent: route.permition,
          permitionCurrentDesc: route.description,
          dateApplication: body.dateApplication,
          documentTemplateID: body.documentTemplateID,
          users: body.users,
          officeName: user.officeName,
          officeId: user.officeId,
          documentType: body.documentType,
        });

        const documentUpdated = await this.documentRepository.findByPk(
          param.documentId,
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
          personalNumber: user.id,
          fullname: user.fullname,
        });
      }

      if (body.flagUpdateDraft) {
        await document.update({
          body: body.updatedDocument,
          permitionCurrent: route.permition,
          permitionCurrentDesc: route.description,
          dateApplication: body.dateApplication,
          documentTemplateID: body.documentTemplateID,
          users: body.users,
          officeName: user.officeName,
          officeId: user.officeId,
          documentType: body.documentType,
        });
      }

      return res.status(errors.success.code).json(document);
    } catch (e) {
      console.log(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async updateDocumentFlagDeleted(body, param, res) {
    try {
      const document = await this.documentRepository.findByPk(
        param.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      if (!document) return res.sendStatus(errors.notFound.code);

      await document.update({
        dateApplication: body.dateApplication,
        deletedDate: new Date(Date.now()),
        flagDeleted: true,
        deletedAuthorFullname: body.deletedAuthorFullname,
        deletedAuthorPersonalNumber: body.deletedAuthorPersonalNumber,
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

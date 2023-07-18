import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Document } from './document.model';
import { DocumentDTO } from './dto/DocumentDTO';
import { UpdateDocumentDTO } from './dto/updateDocumentDTO';

import { Op, ValidationError } from 'sequelize';
import errors from 'src/utils/errors';
import fetch from 'node-fetch';

import { DocumentRoute } from 'src/documentRoute/documentRoute.model';
import { DocumentType } from 'src/documentType/documentType.model';
import { DocumentOrderLog } from 'src/documentOrderLog/documentOrderLog.model';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document)
    private readonly documentRepository: typeof Document,
  ) {}

  async getAllDocument(req, res) {
    try {
      const filter = { ...req.filter };

      // Проверка и установка фильтра "flagDeleted"
      if (!filter.where) {
        filter.where = {};
      } else {
        filter.where = { ...filter.where };
      }
      filter.where['flagDeleted'] = {
        [Op.eq]: null,
      };

      // Фильтр по officeId
      if (req.query.officeId) {
        filter.where['officeId'] = {
          [Op.eq]: req.query.officeId,
        };
      }

      // Фильтр по fullname
      if (req.query.fullname) {
        filter.where['usernames'] = {
          [Op.iLike]: `%${req.query.fullname}%`,
        };
      }

      // Фильтр по authorFullname и registrationNumber
      if (req.query.authorFullname) {
        if (/\d/.test(req.query.authorFullname)) {
          filter.where['registrationNumber'] = {
            [Op.iLike]: `%${req.query.authorFullname}%`,
          };
        } else {
          filter.where['authorFullname'] = {
            [Op.iLike]: `%${req.query.authorFullname}%`,
          };
        }
      }

      // Фильтр для моих документов
      if (req.query.myDocumentsFlag && req.query.myDocumentsFlag == 'true') {
        const ids = req.user.roles.map((r) => r.idOffice);
        ids.push(req.user.officeId);
        filter.where['officeId'] = {
          [Op.in]: ids,
        };

        filter.where['permitionCurrent'] = {
          [Op.in]: req.user.roles.map((r) => r.idAccessCode),
        };

        filter.where['statusId'] = {
          [Op.eq]: 3,
        };
      }

      // Фильтр по modelDate
      if (req.query.modelDate) {
        if (req.query.modelDate.length == 10) {
          filter.where['dateApplication'] = {
            [Op.eq]: new Date(req.query.modelDate),
          };
        } else {
          const modelDate = JSON.parse(req.query.modelDate);
          filter.where['dateApplication'] = {
            [Op.gte]: new Date(modelDate.from),
            [Op.lte]: new Date(modelDate.to),
          };
        }
      }

      // Проверка роли пользователя
      const isSecretary = req.user.roles.some(
        (r) =>
          r.idAccessCode == 'SDM_SECRETARY_CHECK' ||
          r.idAccessCode == 'SDM_SECRETARY_CHECK' ||
          r.idAccessCode == 'SDM_LABOR_CHECK' ||
          r.idAccessCode == 'SDM_LABOR_REGISTRATION',
      );
      const usersFromArm = Object.keys(
        await (
          await fetch(
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
          )
        ).json(),
      ).map((x) => Number(x));
      usersFromArm.push(req.user.id);

      const isAdmin = req.user.roles.some(
        (r) => r.idAccessCode == 'UEMI_ADMIN',
      );

      // Фильтр для секретаря
      if (!isAdmin && isSecretary && !req.query.officeId) {
        const arr = req.user.roles
          .filter((x) => x.idAccessCode.includes('SDM'))
          .map((l) => l.idOffice);
        arr.push(req.user.officeId);
        const newArr = arr.filter(function (item, pos) {
          return arr.indexOf(item) == pos;
        });
        filter.where['officeId'] = {
          [Op.in]: newArr,
        };
      }

      // Фильтр для обычного пользователя
      if (!isAdmin && !isSecretary) {
        filter.where['authorPersonalNumber'] = {
          [Op.eq]: req.user.id,
        };

        filter.where = {
          ...filter.where,
          [Op.or]: [
            { authorPersonalNumber: req.user.id },
            {
              users: {
                [Op.or]: usersFromArm.map((en) => {
                  return {
                    [Op.contains]: [
                      {
                        employeeNumber: en,
                      },
                    ],
                  };
                }),
              },
            },
          ],
        };
      }

      const documents = await this.documentRepository.findAll({
        ...filter,
        flagDeleted: [
          {
            [Op.eq]: null,
          },
        ],
        include: [{ all: true, nested: true, duplicating: true }],
        limit: 100,
      });

      return res.status(errors.success.code).json(documents);
    } catch (e) {
      console.log('/////////////');

      console.warn(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getDocumentById(req, res) {
    try {
      const document = await this.documentRepository.findByPk(
        req.params.documentId,
        {
          include: [{ all: true, nested: true, duplicating: true }],
        },
      );

      const route = await DocumentRoute.findOne({
        where: {
          orderId: document.dataValues.order,
          documentType: document.dataValues.documentType,
        },
        include: [{ all: true, nested: true, duplicating: true }],
      });

      return res.status(errors.success.code).json({ document, route });
    } catch (e) {
      console.log(e.message);

      return res.sendStatus(errors.internalServerError.code);
    }
  }

  // async addNewDocument(req, res) {
  //   try {
  //     const route = await DocumentRoute.findOne({
  //       where: {
  //         orderId: 1,
  //         documentType: req.body.documentType,
  //       },
  //     });
  //     if (!route) {
  //       return res.sendStatus(errors.notFound.code);
  //     }
  //     const type = await DocumentType.findOne({
  //       where: {
  //         id: req.body.documentType,
  //       },
  //     });
  //     if (!type) {
  //       return res.sendStatus(errors.notFound.code);
  //     }
  //     const document = await this.documentRepository.create({
  //       body: req.body.body,
  //       documentType: type.dataValues.id,
  //       documentTypeDescription: type.dataValues.description,
  //       authorPersonalNumber: req.user.id,
  //       authorFullname: req.user.fullname,
  //       dateApplication: req.body.dateApplication,
  //       statusId: 3,
  //       order: 1,
  //       permitionCurrent: route.dataValues.permition,
  //       permitionCurrentDesc: route.dataValues.description,
  //       documentTemplateID: req.body.documentTemplateID,
  //       users: req.body.users,
  //       usernames: req.body.users.map((u) => u.fullname).join(),
  //       officeName: req.body.officeName,
  //     });
  //     return res.status(errors.success.code).json(document.dataValues);
  //   } catch (e) {
  //     console.log(e);
  //     if (e instanceof ValidationError) {
  //       return res.sendStatus(errors.badRequest.code);
  //     }
  //     return res.sendStatus(errors.internalServerError.code);
  //   }
  // }

  // async addNewDocumentInDraft(req, res) {
  //   try {
  //     const route = await DocumentRoute.findOne({
  //       where: {
  //         orderId: 1,
  //         documentType: req.body.documentType,
  //       },
  //     });
  //     if (!route) {
  //       return res.sendStatus(errors.notFound.code);
  //     }
  //     const type = await DocumentType.findOne({
  //       where: {
  //         id: req.body.documentType,
  //       },
  //     });
  //     if (!type) {
  //       return res.sendStatus(errors.notFound.code);
  //     }
  //     const document = await this.documentRepository.create({
  //       body: req.body.body,
  //       documentType: type.dataValues.id,
  //       documentTypeDescription: type.dataValues.description,
  //       authorPersonalNumber: req.user.id,
  //       authorFullname: req.user.fullname,
  //       dateApplication: req.body.dateApplication,
  //       statusId: 1,
  //       order: 1,
  //       permitionCurrent: route.dataValues.permition,
  //       permitionCurrentDesc: route.dataValues.description,
  //       documentTemplateID: req.body.documentTemplateID,
  //       users: req.body.users,
  //       usernames: req.body.users
  //         ? req.body.users.map((u) => u.fullname).join(' ')
  //         : '',
  //       officeName: req.body.officeName,
  //       officeId: req.body.officeId,
  //     });
  //     const routeNext = await DocumentRoute.findOne({
  //       where: {
  //         orderId: 1,
  //         documentType: document.dataValues.documentType,
  //       },
  //     });
  //     await DocumentOrderLog.create({
  //       documentId: document.dataValues.id,
  //       order: document.dataValues.order,
  //       orderDescription: routeNext.dataValues.description,
  //       statusDescription: 'Черновик',
  //       personalNumber: req.user.id,
  //       fullname: req.user.fullname,
  //     });
  //     return res.status(errors.success.code).json(document.dataValues);
  //   } catch (e) {
  //     console.log(e);
  //     if (e instanceof ValidationError) {
  //       return res.sendStatus(errors.badRequest.code);
  //     }
  //     return res.sendStatus(errors.internalServerError.code);
  //   }
  // }

  // async updateDocumentByDocumentId(req, res) {
  //   try {
  //     const document = await this.documentRepository.findByPk(
  //       req.params.documentId,
  //       {
  //         include: [{ all: true, nested: true, duplicating: true }],
  //       },
  //     );

  //     const route = await DocumentRoute.findOne({
  //       where: {
  //         orderId: document.dataValues.order,
  //         documentType: document.dataValues.documentType,
  //       },
  //       include: [{ all: true, nested: true, duplicating: true }],
  //     });

  //     if (!route) {
  //       return res.sendStatus(errors.forbidden.code);
  //     }
  //     if (
  //       req.user.roles
  //         .map((r) => r.idAccessCode)
  //         .includes(route.dataValues.permition)
  //     ) {
  //       if (document.dataValues.statusId == 3 && req.body.agree) {
  //         if (document.dataValues.order == 3) {
  //           await document.update({
  //             registrationNumber: req.body.registrationNumber,
  //           });
  //         }
  //         if (document.dataValues.order < 4) {
  //           const orderNext = document.dataValues.order + 1;
  //           var routeNext = await DocumentRoute.findOne({
  //             where: {
  //               orderId: orderNext,
  //               documentType: document.dataValues.documentType,
  //             },
  //           });
  //           if (!route) {
  //             return res.sendStatus(errors.notFound.code);
  //           }
  //           await document.update({
  //             order: orderNext,
  //             permitionCurrent: routeNext.dataValues.permition,
  //             permitionCurrentDesc: routeNext.dataValues.description,
  //           });
  //         } else {
  //           await document.increment('statusId', { by: 1 });
  //           var routeNext = await DocumentRoute.findOne({
  //             where: {
  //               orderId: 4,
  //               documentType: document.dataValues.documentType,
  //             },
  //           });
  //         }
  //       } else if (document.dataValues.statusId == 3 && !req.body.agree) {
  //         var routeNext = await DocumentRoute.findOne({
  //           where: {
  //             orderId: 1,
  //             documentType: document.dataValues.documentType,
  //           },
  //         });
  //         if (!route) {
  //           return res.sendStatus(errors.notFound.code);
  //         }
  //         await document.update({
  //           statusId: 2,
  //           order: 1,
  //           permitionCurrent: routeNext.dataValues.permition,
  //           permitionCurrentDesc: routeNext.dataValues.description,
  //           message: req.body.message,
  //           messageUserId: req.user.id,
  //           messageUserFullname: req.user.fullname,
  //         });
  //       }
  //       //для обновления статуса
  //       const documentNew = await this.documentRepository.findByPk(
  //         req.params.documentId,
  //         {
  //           include: [{ all: true, nested: true, duplicating: true }],
  //         },
  //       );
  //       await DocumentOrderLog.create({
  //         documentId: documentNew.dataValues.id,
  //         order: documentNew.dataValues.order,
  //         orderDescription: routeNext.dataValues.description,
  //         statusDescription:
  //           documentNew.dataValues.status.dataValues.description,
  //         personalNumber: req.user.id,
  //         fullname: req.user.fullname,
  //         message: req.body.message,
  //         registrationNumber: req.body.registrationNumber,
  //       });
  //       return res.status(errors.success.code).json(document);
  //     }
  //     return res.sendStatus(errors.forbidden.code);
  //   } catch (e) {
  //     console.log(e);
  //     return res.sendStatus(errors.internalServerError.code);
  //   }
  // }

  // async updateDocumentInfoForRole(req, res, next) {
  //   try {
  //     const document = await this.documentRepository.findByPk(
  //       req.params.documentId,
  //       {
  //         include: [{ all: true, nested: true, duplicating: true }],
  //       },
  //     );

  //     await document.update({
  //       dateApplication: req.body.dateApplication,
  //       body: req.body.updatedDocument,
  //       users: req.body.users,
  //       officeName: req.body.officeName,
  //       officeId: req.body.officeId,
  //     });
  //     return next();
  //   } catch (e) {
  //     console.log(e);
  //     return res.sendStatus(errors.internalServerError.code);
  //   }
  // }

  // async updateDocumentFromDraftAndRevisionByDocumentId(req, res) {
  //   try {
  //     const document = await this.documentRepository.findByPk(
  //       req.params.documentId,
  //       {
  //         include: [{ all: true, nested: true, duplicating: true }],
  //       },
  //     );
  //     if (!document) {
  //       return res.sendStatus(errors.notFound.code);
  //     }
  //     const route = await DocumentRoute.findOne({
  //       where: {
  //         orderId: 1,
  //         documentType: req.body.documentType,
  //       },
  //     });
  //     if (!route) {
  //       return res.sendStatus(errors.notFound.code);
  //     }
  //     if (
  //       req.user.id == document.dataValues.authorPersonalNumber &&
  //       !req.body.flagUpdateDraft
  //     ) {
  //       await document.update({
  //         body: req.body.updatedDocument,
  //         statusId: 3,
  //         order: 1,
  //         permitionCurrent: route.dataValues.permition,
  //         permitionCurrentDesc: route.dataValues.description,
  //         dateApplication: req.body.dateApplication,
  //         documentTemplateID: req.body.documentTemplateID,
  //         users: req.body.users,
  //         officeName: req.body.officeName,
  //         officeId: req.body.officeId,
  //         documentType: req.body.documentType,
  //       });
  //       const documentUpdated = await this.documentRepository.findByPk(
  //         req.params.documentId,
  //         {
  //           include: [{ all: true, nested: true, duplicating: true }],
  //         },
  //       );
  //       const routeNext = await DocumentRoute.findOne({
  //         where: {
  //           orderId: 1,
  //           documentType: document.dataValues.documentType,
  //         },
  //       });
  //       await DocumentOrderLog.create({
  //         documentId: documentUpdated.dataValues.id,
  //         order: documentUpdated.dataValues.order,
  //         orderDescription: routeNext.dataValues.description,
  //         statusDescription:
  //           documentUpdated.dataValues.status.dataValues.description,
  //         personalNumber: req.user.id,
  //         fullname: req.user.fullname,
  //       });
  //     }
  //     if (req.body.flagUpdateDraft) {
  //       await document.update({
  //         body: req.body.updatedDocument,
  //         permitionCurrent: route.dataValues.permition,
  //         permitionCurrentDesc: route.dataValues.description,
  //         dateApplication: req.body.dateApplication,
  //         documentTemplateID: req.body.documentTemplateID,
  //         users: req.body.users,
  //         officeName: req.body.officeName,
  //         officeId: req.body.officeId,
  //         documentType: req.body.documentType,
  //       });
  //     }
  //     return res.status(errors.success.code).json(document);
  //   } catch (e) {
  //     console.log(e);
  //     return res.sendStatus(errors.internalServerError.code);
  //   }
  // }

  // async updateDocumentFlagDeleted(req, res) {
  //   try {
  //     const document = await this.documentRepository.findByPk(
  //       req.params.documentId,
  //       {
  //         include: [{ all: true, nested: true, duplicating: true }],
  //       },
  //     );
  //     if (!document) {
  //       return res.sendStatus(errors.notFound.code);
  //     }
  //     await document.update({
  //       dateApplication: req.body.dateApplication,
  //       deletedDate: new Date(Date.now()),
  //       flagDeleted: true,
  //       deletedAuthorFullname: req.body.deletedAuthorFullname,
  //       deletedAuthorPersonalNumber: req.body.deletedAuthorPersonalNumber,
  //     });
  //     return res.status(errors.success.code).json(document);
  //   } catch (e) {
  //     return res.sendStatus(errors.internalServerError.code);
  //   }
  // }

  // async deleteAllDocuments(res) {
  //   try {
  //     this.documentRepository.destroy({
  //       where: {},
  //     });
  //     return res.status(errors.success.code).json('delete all');
  //   } catch (e) {
  //     return res.sendStatus(errors.internalServerError.code);
  //   }
  // }
}

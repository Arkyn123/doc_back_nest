import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Document } from './document.model';
import { DocumentDTO } from './dto/DocumentDTO';
import { UpdateDocumentDTO } from './dto/updateDocumentDTO';

import { Op } from 'sequelize';
import errors from 'src/utils/errors';
import fetch from 'node-fetch';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Document)
    private readonly documentRepository: typeof Document,
  ) {}

  async getAllDocuments(req, res) {
    console.log('\nMiddleware сработали\n');
    try {
      const filter = { ...req.filter };

      filter.where = !filter.where ? {} : { ...filter.where };

      filter.where['flagDeleted'] = {
        [Op.eq]: null,
      };

      req.query.officeId
        ? (filter.where['officeId'] = { [Op.eq]: req.query.officeId })
        : null;

      req.query.fullname
        ? (filter.where['usernames'] = {
            [Op.iLike]: `%${req.query.fullname}%`,
          })
        : null;

      req.query.authorFullname && /\d/.test(req.query.authorFullname)
        ? (filter.where['registrationNumber'] = {
            [Op.iLike]: `%${req.query.authorFullname}%`,
          })
        : null;

      req.query.authorFullname && !/\d/.test(req.query.authorFullname)
        ? (filter.where['authorFullname'] = {
            [Op.iLike]: `%${req.query.authorFullname}%`,
          })
        : null;

      if (req.query.myDocumentsFlag && req.query.myDocumentsFlag == 'true') {
        const ids = req.user.roles.map((r) => r.idOffice);
        ids.push(req.user.officeId);
        filter.where['officeId'] = { [Op.in]: ids };

        filter.where['permitionCurrent'] = {
          [Op.in]: req.user.roles.map((r) => r.idAccessCode),
        };

        filter.where['statusId'] = { [Op.eq]: 3 };
      }

      req.query.modelDate
        ? req.query.modelDate.length == 10
          ? (filter.where['dateApplication'] = {
              [Op.eq]: new Date(req.query.modelDate),
            })
          : (() => {
              const modelDate = JSON.parse(req.query.modelDate);
              filter.where['dateApplication'] = {
                [Op.gte]: new Date(modelDate.from),
                [Op.lte]: new Date(modelDate.to),
              };
            })()
        : null;

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

      if (!isAdmin && isSecretary && !req.query.officeId) {
        const arr = req.user.roles
          .filter((x) => x.idAccessCode.includes('SDM'))
          .map((l) => l.idOffice);
        arr.push(req.user.officeId);
        const newArr = arr.filter((item, pos) => arr.indexOf(item) == pos);
        filter.where['officeId'] = { [Op.in]: newArr };
      }

      if (!isAdmin && !isSecretary) {
        filter.where = {
          ...filter.where,
          [Op.or]: [
            { authorPersonalNumber: req.user.id },
            {
              users: {
                [Op.or]: usersFromArm.map((en) => ({
                  [Op.contains]: [{ employeeNumber: en }],
                })),
              },
            },
          ],
        };
        filter.where['authorPersonalNumber'] = { [Op.eq]: req.user.id };
      }

      const documents = await Document.findAll({
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
      console.warn(e.message);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  getDocumentById(documentId: string) {
    return `getDocumentById${documentId}`;
  }

  addNewDocument(DocumentDTO: DocumentDTO) {
    throw new Error('Method not implemented.');
  }

  addNewDocumentInDraft(DocumentDTO: DocumentDTO) {
    throw new Error('Method not implemented.');
  }

  updateDocumentByDocumentId(
    documentId: string,
    updateDocumentDTO: UpdateDocumentDTO,
  ) {
    throw new Error('Method not implemented.');
  }

  updateDocumentInfoForRole(
    documentId: string,
    updateDocumentDTO: UpdateDocumentDTO,
  ) {
    throw new Error('Method not implemented.');
  }

  updateDocumentFromDraftAndRevisionByDocumentId(documentId: string) {
    throw new Error('Method not implemented.');
  }

  updateDocumentFlagDeleted(documentId: string) {
    throw new Error('Method not implemented.');
  }

  deleteAllDocuments() {
    throw new Error('Method not implemented.');
  }
}

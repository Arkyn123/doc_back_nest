import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError } from 'sequelize';
import { DocumentRoute } from './documentRoute.model';
import errors from 'src/utils/errors';

@Injectable()
export class DocumentRouteService {
  constructor(
    @InjectModel(DocumentRoute)
    private readonly documentRouteRepository: typeof DocumentRoute,
  ) {}

  async getAllDocumentRoute(req, res) {
    try {
      const documentRoutes = await this.documentRouteRepository.findAll({
        include: [{ all: true, nested: true, duplicating: true }],
      });
      return res.status(errors.success.code).json(documentRoutes);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getDocumentRouteByDocumentTypeId(req, res) {
    try {
      const documentRoutes = await this.documentRouteRepository.findAll({
        where: {
          documentTypeId: req.params.documentTypeId,
        },
        include: [{ all: true, nested: true, duplicating: true }],
      });

      return res.status(errors.success.code).json(documentRoutes);
    } catch (e) {
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocumentRoute(req, res) {
    try {
      const result = await this.documentRouteRepository.create({ ...req.body });
      return res.status(errors.success.code).json(result.dataValues);
    } catch (e) {
      console.log(e);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async deleteDocumentRouteById(req, res) {
    try {
      const result = await this.documentRouteRepository.findByPk(
        req.params.documentTypeId,
      );
      if (!result) {
        return res.sendStatus(errors.notFound.code);
      }
      await result.destroy();
      return res.sendStatus(errors.success.code);
    } catch (e) {
      console.log(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}

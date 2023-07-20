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
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async getDocumentRouteByDocumentTypeId(req, res) {
    try {
      const documentRoutes = await this.documentRouteRepository.findAll({
        where: {
          documentType: req.params.documentTypeId,
        },
        include: [{ all: true, nested: true, duplicating: true }],
      });

      return res.status(errors.success.code).json(documentRoutes);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async addNewDocumentRoute(req, res) {
    try {
      const { id: ownerId, fullname: ownerFullname } = req.user;

      const documentRoutes = await this.documentRouteRepository.create({
        ...req.body,
        ownerId,
        ownerFullname,
      });

      return res.status(errors.success.code).json(documentRoutes);
    } catch (e) {
      console.warn(e.message);
      if (e instanceof ValidationError) {
        return res.sendStatus(errors.badRequest.code);
      }
      return res.sendStatus(errors.internalServerError.code);
    }
  }

  async deleteDocumentRouteById(req, res) {
    try {
      const documentRoutes = await this.documentRouteRepository.findByPk(
        req.params.documentTypeId,
      );

      if (!documentRoutes) return res.sendStatus(errors.notFound.code);

      await documentRoutes.destroy();

      return res.sendStatus(errors.success.code);
    } catch (e) {
      console.warn(e);
      return res.sendStatus(errors.internalServerError.code);
    }
  }
}

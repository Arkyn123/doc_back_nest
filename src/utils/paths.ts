import { RequestMethod } from '@nestjs/common';

const setPermissionsPaths = [
  { path: 'dicOffice/add', method: RequestMethod.POST },
  { path: 'dicOffice/update/:id', method: RequestMethod.PUT },
  { path: 'dicOffice/delete/:id', method: RequestMethod.PUT },

  { path: 'dicOfficeCorrespondence/add', method: RequestMethod.POST },
  { path: 'dicOfficeCorrespondence/update/:id', method: RequestMethod.PUT },
  { path: 'dicOfficeCorrespondence/delete/:id', method: RequestMethod.PUT },

  { path: 'document/:documentId', method: RequestMethod.GET },
  { path: 'document/add', method: RequestMethod.POST },
  { path: 'document/addInDraft', method: RequestMethod.POST },
  { path: 'document/update/:documentId', method: RequestMethod.PUT },
  {
    path: 'document/updateFromDraftAndRevision/:documentId',
    method: RequestMethod.PUT,
  },
  {
    path: 'document/updateInfoForRole/:documentId',
    method: RequestMethod.PUT,
  },
  {
    path: 'document/updateDocumentFlagDeleted/:documentId',
    method: RequestMethod.PUT,
  },
  {
    path: 'document/delete',
    method: RequestMethod.DELETE,
  },

  { path: 'documentRoute', method: RequestMethod.GET },
  { path: 'documentRoute/:documentTypeId', method: RequestMethod.GET },
  { path: 'documentRoute/add', method: RequestMethod.POST },
  {
    path: 'documentRoute/delete/:documentTypeId',
    method: RequestMethod.DELETE,
  },

  { path: 'documentStatus', method: RequestMethod.GET },
  { path: 'documentStatus/add', method: RequestMethod.POST },

  { path: 'documentType', method: RequestMethod.GET },

  { path: 'findMSSQL/schedule', method: RequestMethod.GET },
  { path: 'findMSSQL/brigada', method: RequestMethod.GET },

  { path: 'user', method: RequestMethod.GET },
];
const setPermissionsPathsPlusSequelizeFiltering = [
  { path: 'dicOffice', method: RequestMethod.GET },

  { path: 'dicOfficeCorrespondence', method: RequestMethod.GET },

  { path: 'document', method: RequestMethod.GET },

  { path: 'documentType/add', method: RequestMethod.POST },
];

export { setPermissionsPaths, setPermissionsPathsPlusSequelizeFiltering };

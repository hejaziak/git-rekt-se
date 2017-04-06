const ClientAuthAPI = require('./api/v1/client/auth');
const BusinessAuthAPI = require('./api/v1/business/auth');
const BusinessEditInformationAPI = require('./api/v1/business/editinformation.js');
const ViewBussinessAPI = require('./api/v1/business/index');
const RelatedBusinessAPI = require('./api/v1/business/related');
const AdminAuthAPI = require('./api/v1/admin/auth');
const ClientProfileAPI = require('./api/v1/client/profile');
const ViewServiceAPI = require('./api/v1/service/index');
const RelatedServiceAPI = require('./api/v1/service/related');
const reviewCRUDAPI = require('./api/v1/service/review');
const admincatAPI = require('./api/v1/admin/category');
const BusinessProfileAPI = require('./api/v1/business/profile');
const BusinessGalleryAPI = require('./api/v1/business/gallery');


module.exports = (app) => {
  /**
   * Visitor Routes.
   */

  app.use('/api/v1/service', ViewServiceAPI);
  app.use('/api/v1/business', ViewBussinessAPI);
  app.use('/api/v1/service/category', RelatedServiceAPI);
  app.use('/api/v1/business/category', RelatedBusinessAPI);

  /**
   * Client Routes.
   */

  app.use('/api/v1/client/auth', ClientAuthAPI);
  app.use('/api/v1/client/profile', ClientProfileAPI);

  /**
   * Business Routes.
   */

  app.use('/api/v1/business/auth', BusinessAuthAPI);
  app.use('/api/v1/business/profile', BusinessProfileAPI);
  app.use('/api/v1/business/info', BusinessEditInformationAPI);

  /**
   * Admin Routes.
   */

  app.use('/api/v1/admin/auth', AdminAuthAPI);

  /**
   * Service Routes.
   */
<<<<<<< HEAD
  app.use('/api/v1/business/gallery', BusinessGalleryAPI);
=======
  app.use('/api/v1/admin/category', admincatAPI);

>>>>>>> e5997df75a0ee640282cecd5cbb6587c32a2f986
  app.use('/api/v1/service', reviewCRUDAPI);
};

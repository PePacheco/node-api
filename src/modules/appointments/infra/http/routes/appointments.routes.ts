import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentRouter = Router();
const appointmentsController = new AppointmentsController();

// Route : http://localhost:3333/appointments

appointmentRouter.use(ensureAuthenticated);

// appointmentRouter.get('/', async (request, response) => {
//     return response.json(await appointmentsRepository.find());
// });

appointmentRouter.post('/', appointmentsController.create);

export default appointmentRouter;
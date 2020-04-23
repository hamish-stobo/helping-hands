import * as express from 'express';
import { getConnection } from 'typeorm';
import register from './users/register';
import request from './request/request';
import login from './auth/login';
import logout from './auth/logout';
import users from './users/user';
import profile from './users/profile';
import updateUser from './users/updateUser';
import deleteUser from './users/delete';
import buddy from './buddy';

let router = express.Router();

router.get("/users", async function(req: express.Request, res: express.Response) {
	getConnection('default').getRepository('Users').count().then((num) => {
		res.status(200).send({num});
	})
});

router.use('/profile', profile)
router.use('/user', users)
router.use('/register', register)
router.use('/requests', request)
router.use('/login', login)
router.use('/logout', logout)
router.use('/update', updateUser)
router.use('/deleteUser', deleteUser)

router.use('/buddy', buddy);

export default router;

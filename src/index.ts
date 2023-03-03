import express, {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import jwt  from 'jsonwebtoken';

dotenv.config();

const app: Express = express();
app.use(express.json());

const port = 3000;

app.post('/api/createUser/', (req, res) => {
  const  { username } = req.body;
  const token = jwt.sign({username: username}, 
    process.env.TOKEN_SECRET!, {
      expiresIn: '1800s'
    });
  res.status(200).json({token: token});
});

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token!, process.env.TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/login', authenticateToken, (req: Request, res: Response) => {
  res.json({msg: 'Authenticated'});
});

app.listen(port);
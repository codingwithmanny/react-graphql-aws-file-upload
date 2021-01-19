// IMPORTS
// ------------------------------------------------------------
import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { applyMiddleware } from 'graphql-middleware';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import path from 'path';
import cors from 'cors';

// GraphlQL
import { typeDefs, resolvers } from './graphql';

// Types
interface ContextProps {
  req: Request;
  res: Response;
}

// ENVIRONMENT VARS
// ------------------------------------------------------------
const PORT = process.env.PORT || 8080;

// ENVIRONMENT VARS
// ------------------------------------------------------------
const uploadLocal = multer({ dest: 'files' }).single('file');

// req.file
// req.body.variables.file

// MIDDLEWARE HERE -----------------
const uploadMiddleware = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: any,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  console.group('uploadMiddleware');
  
  // console.log(context.req.body.variables);
  // context.req.file = context.req.body.variables.file;
  // console.log(context.req);
  console.log(context.req.file);
  // return resolve(parent, args, context, info);
  return await new Promise((rsv, reject) => {
    uploadLocal(context.req, context.res, (err: any) => {
      if (err) {
        console.log('ERROR');
        console.log(err);
        reject(err);
        throw err;
      }
      console.log('FINISHED');
      rsv(true);
    })
  }).then(() => {
    console.log('resolved END');
    console.groupEnd();
    return resolve(parent, args, context, info)
  });
}
// END MIDDLEWARE HERE -----------------

const uploadMiddlewares = {
  Mutation: {
    singleUploadStream: uploadMiddleware
  }
}

// CONFIG
// ------------------------------------------------------------
config();
const middlewares: any = [uploadMiddlewares];
const app = express();
// const myMiddleware = (req: any, res: any, next: any) => {
//   console.log(req.file);
//   console.log(req.body);
//   next();
// }
// app.use(bodyParser);
// app.use(uploadLocal);
app.use(cors());
// app.use(myMiddleware);
const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddlware = applyMiddleware(schema, ...middlewares);
const context = ({ req, res }: ContextProps) => ({ req, res });
const graphql = new ApolloServer({
  schema: schemaWithMiddlware,
  context
});

graphql.applyMiddleware({
  app,
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});


AWS.config.loadFromPath(path.join(__dirname, 'credentials.json'));
// const UPLOAD_PATH = process.env.UPLOAD_PATH || './files';
const s3 = new AWS.S3();

// s3.on('httpUploadProgress', (progress: any) => {
//   console.log('progress', progress);
// })

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET || 'Unknown',
    key: (req, file, cb) => {
      console.log('key', file);
      cb(null, file.originalname);
    },
  })
})


app.post('/upload', upload.single('file'), (req, res) => {
  res.send({
    success: true
  })
});

// app.post('/upload', upload.single('file'), (req, res) => {
//   res.send({
//     success: true
//   })
// });

// app.use('/graphql', b)

// ROUTES
// ------------------------------------------------------------

// LISTEN
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
  console.log(`GraphQL started on port ${PORT}${graphql.graphqlPath}`);
  console.log(process.env.AWS_S3_BUCKET);
});

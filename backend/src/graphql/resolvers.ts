// IMPORTS
// ------------------------------------------------------------
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import stream from 'stream';

// CONFIG
// ------------------------------------------------------------
AWS.config.loadFromPath(path.join(__dirname, '..', 'credentials.json'));
const UPLOAD_PATH = process.env.UPLOAD_PATH || './files';
const s3 = new AWS.S3();

// MAIN RESOLVES
// ------------------------------------------------------------
const resolvers = {
    // Queries
    Query: {
        health: () => 'Ok!'
    },
    // Mutations
    Mutation: {
        singleUpload: (_parent: any, args: any) => {
            return args.file.then((file: any) => {
                const { createReadStream, filename } = file;
                const fileStream = createReadStream()
                fileStream.pipe(fs.createWriteStream(`${UPLOAD_PATH}/${filename}`))
                return file;
            });
        },
        multiUpload: async (_parent: any, args: any) => {
            return await args.files.map(async (file: any) => {
                const { createReadStream, filename } = await file;
                const fileStream = createReadStream()
                fileStream.pipe(fs.createWriteStream(`${UPLOAD_PATH}/${filename}`))
                return file;
            });
        },
        singleUploadStream: async (_parent: any, args: any) => {
            // // ATTEMP 1
            // // console.log(args.file);
            // const uploadStream = (s3: any) => {
            //     console.log('uploadStream');
            //     const pass = new stream.PassThrough();
            //     const uploadParams = { Bucket: process.env.AWS_S3_BUCKET || 'Unknown Bucket', Key: filename, Body: fileStream };
            //     s3.upload(uploadParams).on('httpUploadProgress', (progress: any) => {
            //         console.log('progress', progress);
            //     });
            //     return pass;
            // };

            // // // const file = await args.file;
            // const { createReadStream, filename } = await args.file;
            // const fileStream = createReadStream();
            // await fileStream.pipe(uploadStream(s3));
            // // END - ATTEMP 1

            // ATTEMPT 2
            // const uploadStream = async ({ filename }: any) => {
            //     const Body = new stream.PassThrough();

            //     s3.upload({
            //         Bucket: process.env.AWS_S3_BUCKET || 'Unknown Bucket', Key: filename, Body
            //     })
                // .on('httpUploadProgress', progress => {
                //     console.log('progress', progress);
                // })
            //     .send((err: any, data: any) => {
            //       if (err) {
            //         Body.destroy(err);
            //       } else {
            //         console.log(`File uploaded and available at ${data.Location}`);
            //         Body.destroy();
            //       }
            //     });
                
            //     return Body;
            // }
            // END ATTEMPT 2

            // // ATTEMPT 3
            // const { filename, createReadStream } = await args.file;
            // const uploadStream = (S3: any, Bucket: string, Key: string) => {
            //     const pass = new stream.PassThrough();
            //     return {
            //         writeStream: pass,
            //         promise: S3.upload({ Bucket, Key, Body: pass }).on('httpUploadProgress', (progress: any) => {
            //             console.log('progress', progress);
            //         }).promise()
            //     }
            // }
            // const { writeStream, promise } = uploadStream(s3, process.env.AWS_S3_BUCKET || 'Unknown Bucket', filename);
            
            // createReadStream().pipe(writeStream);

            // const result = await promise;
            // // END ATTEMPT 3

            // ATTEMP 4
            // const uploadFromStream = (s3: any, filename: string) => {
            //     const pass = new stream.PassThrough();
            //     s3.upload({ Bucket: process.env.AWS_S3_BUCKET || 'Unknown Bucket', Key: filename, Body: pass }, (err: any, data: any) => {
            //         console.log(err, data);
            //     })
            //         .on('httpUploadProgress', (progress: any) => {
            //             console.log('progress', progress);
            //         });
            //     return pass;
            // }
            // const { createReadStream, filename } = await args.file;
            // const inputStream = createReadStream();
            // await inputStream.pipe(uploadFromStream(s3, filename));
            // END ATTEMPT4


            // const { createReadStream, filename } = await args.file;
            // const pipeline = await createReadStream().pipe(uploadStream({ filename }));
            // pipeline.on('close', () => {
            //     console.log('pipeline - DONE');
            //     // upload finished, do something else
            //   })
            // pipeline.on('error', (err: any) => {
            //     console.log('pipeline - ERROR');
            //     console.log(err);
            //     // upload wasn't successful. Handle it
            // });

            return args.file;


            // const { createReadStream, filename } = await args.file;
            // const fileStream = createReadStream();
            // const uploadParams = { Bucket: process.env.AWS_S3_BUCKET || 'Unknown Bucket', Key: filename, Body: fileStream };
            // const uploader = s3.upload(uploadParams);
            // uploader.on('httpUploadProgress', (progress: any) => {
            //     console.log('progress', progress);
            // });
            // uploader.on('')


            // fileStream.pipe(fs.createWriteStream(`${UPLOAD_PATH}/${filename}`))
            // console.log(createReadStream);
            // createReadStream().pipe;
            // const fileStream = createReadStream();


            // try {
            //     await s3.upload(uploadParams).promise();
            // } catch (error) {
            //     console.log('ERROR', error);
            //     throw new Error(error);
            // }

            // return args.file;
        }
    }
};

// EXPORTS
// ------------------------------------------------------------
export default resolvers;
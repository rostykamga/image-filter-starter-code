import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {Request, Response} from 'express';

const validURL = require('valid-url');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @DONE1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @DONE1

  app.get("/filteredimage", async (req:Request, res:Response, next:NextFunction) => {

    //1. validate the image_url query
    if(!req.query.image_url || !validURL.isUri(req.query.image_url)){
      res.status(400).send({message: 'Bad request'});
    }
    else{

      //2. call filterImageFromURL(image_url) to filter the image
      const filteredpath:string = await filterImageFromURL(req.query.image_url);

      //3. send the resulting file in the response
      res.status(200).sendFile(filteredpath, (err)=>{
        if(err){
          console.log(err);
          next();
        }
        else{
          //4. deletes any files on the server on finish of the response
          const filesToDelete:Array<string> = new Array<string>();

          filesToDelete.push(filteredpath);

          deleteLocalFiles(filesToDelete);

          next();

        }
      });
    }

  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
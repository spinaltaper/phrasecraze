'use strict';

import bodyParser from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Script from '../model/script-model';


const scriptRouter = new Router();
const jsonParser = bodyParser.json();

const Word = class {
  constructor(content, placement) {
    this.content = content;
    this.placement = placement;
  }
};

scriptRouter.post('/script', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad Content: Title Required'));
  return new Script(request.body).save()
    .then((script) => {
      // parsing the keywords out of the script
      const keywords = script.content.match((/(?<=\[)(.*?)(?=\])/g));
      // returns array
      const solution = {};
      solution.keywordsArray = [];
      solution.title = script.title;
      for (let i = 0; i < keywords.length; i++) {
        solution.keywordsArray.push(new Word(keywords[i], i));
      }
      return solution;
    })
    .then((solution) => {
      return response.json(solution);
    })
    .catch(next);
});

// scriptRouter.get('/script/:id', (request, response, next) => {
//   console.log(request, 'this is the request in GET route');
//   console.log(response, 'this is the response in the GET route');
//   // logger.log(logger.INFO, 'GET - processing a request');
//   return Script.findById(request.params.id)
//     .then((script) => {
//       if (!script) {
//         logger.log(logger.INFO, 'GET - responding with a 404 status code - (!script)');
//         return response.sendStatus(404);
//       }
//       logger.log(logger.INFO, 'GET - responding with a 200 status code');
//       return response.json(script);
//     })
//     .catch(next);
// });

// Expected 

// scriptRouter.post('/keys', jsonParser, (request, response, next) => {
//   console.log(request.body.title);
//   return Script.findOne(request.body.title)
//     .then((script) => {
//       // panos Magic logic
//       return updatedScript;
//     });
// });

// added

scriptRouter.put('/keys', jsonParser, (request, response, next) => {
  if (!request.body) return next(new HttpError(400, 'Bad content:  not recieved'));
  const keywords = request.body.keywordsArray;
  let areKeyWordsOrdered = false;
  const keyWordsInOrder = [];

  let counter = 0;
  while (areKeyWordsOrdered === false) { 
    let i = 0;


    while (i !== keywords[counter].placement) { 
      i += 1; 
      if (i >= keywords.length) { areKeyWordsOrdered = true; }
    }
    
    counter += 1;
    keyWordsInOrder.push(keywords[i].content);

    if (counter >= keywords.length) { 
      areKeyWordsOrdered = true; 
    }
  }

  return Script.findOne({ title: request.body.title })
    .then((script) => {
      return response.json(scriptRouter.compileScript(script, keyWordsInOrder)); 
    });
});

scriptRouter.compileScript = (script, keywords) => {
  let solution;
  const findKeyword = /(\[.*?\])/;
  
  for (let i = 0; i < keywords.length; i++) {
    solution = script.content.replace(findKeyword, keywords[i]);
    script.content = solution;
  }
  return script.content;
};

export default scriptRouter;

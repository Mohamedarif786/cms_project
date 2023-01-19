import format from 'string-format'
import dotenv from 'dotenv'
import api from './api.js'
dotenv.config()
const apikey = '6de9eb9f7d2f4e69'
const apisecret = 'b6de9eb9f7d2f4e6'
let url = 'https://evolve.cloudapis.net/club';

export default {
    add: async (req, token) => {
        try {
        let input = {};
        
            input.tierid = parseInt(req.tierid);
            input.clubid = parseInt(req.clubid);
            input.type = req.type;
            
            if(req.video_title)
            {
                input.video_title = req.video_title;
            }
            if(req.video)
            {
                input.video = req.video;
            }
            if(req.image_title)
            {
                input.image_title = req.image_title;
            }
            if(req.image)
            {
                input.image = req.image;
            }
            if(req.text_title)
            {
                input.text_title = req.text_title;
            }
            if(req.text)
            {
                input.text = req.text;
            }
          let gql = {
            query: `queries Newsplash($input: NewSplash) {
                newsplash(input: $input) {
                  code
                  message
                  success
                  result {
                    type
                    clubid
                    tierid
                    image_title
                    image
                    text_title
                    text
                    video
                    language
                    createdat
                    updatedat
                  }
                }
              }`,
            variables: {
              input: input
            },
          }
          console.log(gql);
          let result = await api({
            url,
            headers: {
              type: 'CMS',
              language: req.language,
            },
            gql,
            token,
          })
          console.log(result);
          return result;
        } catch (err) {
          console.log(err)
        }
      },
      list: async (req, token) => {
        try {
          let gql = {
            query:'query SplashListResult{ splashes { success code result { id clubid type language createdat updatedat } }}',
          }
          let result = await api({
            url,
            headers: {
              type: 'CMS',
            },
            gql,
            token,
          })
          if (result.data.splashes) {
            let status = req.status
            let splashe = result.data.splashes.result
            if (status) {
              splashe = splashe.filter(
                (x) => x.status.toLowerCase() === status.toLowerCase(),
              )
            }
            return splashe
          }
        } catch (err) {
          console.log(err)
        }
      },
      remove: async (req, token) => {
        try {
          let gql = {
            query:
              `mutation SplashResult($id: Int) { removeplash(id: $id) { success code message result {
                id
                type
                clubid
                createdat
                updatedat
              }}}`,
            variables: {
              id: parseInt(req.id),
            },
          }
          return await api({
            url,
            headers: { type: 'CMS' ,
            'x-api-key': apikey,
            'x-secret': apisecret},
            gql,
            token,
          })
        } catch (err) {
          console.log(err)
        }
      },
}
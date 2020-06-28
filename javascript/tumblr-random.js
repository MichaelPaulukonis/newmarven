// based on https://github.com/razagill/tumblr-random-posts
// const cheerio = require('cheerio')
const postCount = 20

const cleanup = text => text
  .replace(/\s/g, ' ')
  .replace(/–/g, '--')

const tumblrRandomPost = () => {
  const settings = {
    blogName: 'poeticalbot.tumblr.com',
    appKey: 'soMpL6oJLZq5ovoVYVzU5Qhx5DE87MMrxou6J7tGYLec6XeT6L',
    debug: false
  }
  return new Promise((resolve, reject) => {
    const apiUrl = 'https://api.tumblr.com/v2/blog/' + settings.blogName + '/posts?api_key=' + settings.appKey
    axios.get(apiUrl)
      .then((response) => {
        const rndPost = Math.floor(Math.random() * response.data.response.total_posts)
        return rndPost
      }, (err) => {
        reject(err)
      })
      .then(postId =>
        axios.get(apiUrl + `&offset=${postId}&limit=${postCount}`) // maybe get a bunch of stuff?
          .then((response) => {
            const newCorpus = response.data.response.posts.map((post) => {
              // const body = jQuery('div').html(post.body).text()
              var body = post.body.replace(/(<([^>]+)>)/g, "")
              // also post.url, post.title
              return cleanup(body)
            })
            resolve(newCorpus)
          }))
  })
}

// export default tumblrRandomPost

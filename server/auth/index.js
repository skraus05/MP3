const router = require('express').Router()
const { User } = require('../../models')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body)}); 
  } catch (err) {
    next(err)
  }
})


router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.send({token: await user.generateToken()})
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/highscore', async (req, res, next) => {
  try {
    // Replace 'userId' and 'score' with the actual property names sent by the client
    const { score, userId } = req.body;
  
    // Assuming authentication and user ID retrieval has been handled earlier in the middleware
    const user = await User.findOne({ where: { id: userId } });
    if (score > user.dataValues.highscore) {
      await user.update({highscore: score})
      res.status(200).json(score)
    } else {
      res.send('try again next time pal')
    }
    // Send back the updated high score
    // res.json({ highscore: updatedUser.highscore });
  } catch (err) {
    // Handle errors, such as if the user is not found or the score is not a valid number
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization))
  } catch (ex) {
    next(ex)
  }
})

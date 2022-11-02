const router = require('express').Router();

//import all the API routes
const apiRoutes = require('./routes');

// add the prefix /api to all the routes
router.use('/api', apiRoutes);

router.use((req, res)=>{
    res.status(404).send('<h1> Oops! 404 Error!</h1>');
});

module.exports = router;
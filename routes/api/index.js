/**
 * Created by wse15 on 3/08/17.
 */
const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/projects', require('./projects'));

router.use((err, req, res, next) => {
    if(err.name === 'ValidationError'){
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce((errors, key) => {
                errors[key] = err.errors[key].message;

                return errors;
            }, {})
        });
    }

    return next(err);
});

module.exports = router;
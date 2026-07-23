import * as yup from 'yup';

const schema = yup.object().shape({
    shirtSize: yup.string().required('سایز پیراهن الزامی است'),
});

schema.validate({ shirtSize: '' })
    .then(() => console.log('VALID'))
    .catch(e => console.log('INVALID:', e.message));

schema.validate({ shirtSize: undefined })
    .then(() => console.log('VALID'))
    .catch(e => console.log('INVALID:', e.message));

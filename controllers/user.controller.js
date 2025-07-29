const fetchData = (req, res) => {
    res.render('register');
}

const logData = (req, res) =>{
    res.render('login');
}

module.exports = {
    fetchData,
    logData
}
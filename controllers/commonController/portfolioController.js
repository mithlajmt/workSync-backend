const Contact = require('./../../models/contact');

const saveContact = async (req, res) => {
  const {name, phone, email, subject, message} = req.body;
  console.log(req.body);

  try {
    const newContact = new Contact({
      name,
      phone,
      email,
      subject,
      message,
    });

    await newContact.save();

    res.status(200).json({
      success: true,
      message: 'Contact saved successfully',
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

module.exports = saveContact;

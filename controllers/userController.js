const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400);
      return res.json({ msg: 'Username is taken', status: false });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      return res.json({ msg: 'Email is taken', status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        username: user.username,
        _id: user._id,
        isAdmin: user.role === 'admin',
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: 300,
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
    });
    delete user.password;
    const returnedUser = {
      username: user.username,
      _id: user._id,
    };
    return res.json({ status: true, returnedUser });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: 'Invalid username/password', status: false });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({ msg: 'Invalid username/password', status: false });
    }
    const token = jwt.sign(
      {
        username: user.username,
        _id: user._id,
        isAdmin: user.role === 'admin',
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: 300,
      }
    );
    res.cookie('token', token, {
      httpOnly: true,
    });
    delete user.password;
    const returnedUser = {
      username: user.username,
      _id: user._id,
    };
    return res.json({ status: true, returnedUser });
  } catch (ex) {
    next(ex);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const { username, email, password, revealMode } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ msg: 'User not found', status: false });
    }

    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (typeof revealMode === 'boolean') {
      user.revealMode = revealMode;
    }

    let updatedUser = await user.save();
    updatedUser = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      revealMode: updatedUser.revealMode,
      openMode: updatedUser.openMode,
    };

    return res.json({ status: true, updatedUser });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const currentUser = await User.findById(userId);

    let users;
    if (req.user.isAdmin) {
      users = await User.find({ _id: { $ne: userId } }).select([
        'username',
        'email',
        '_id',
      ]);
    } else if (currentUser.openMode) {
      users = await User.find({
        _id: { $ne: userId },
        revealStatus: { $ne: false },
      }).select(['username', 'email', '_id']);

      const revealStatusTrueUsers = await User.find({
        _id: { $ne: userId },
        revealStatus: { $ne: true },
      }).select(['username', 'email', '_id']);

      users = users.concat(revealStatusTrueUsers);
    } else {
      users = await User.find({ _id: { $ne: userId } }).select([
        'username',
        '_id',
      ]);
    }

    users.sort((a, b) => a.username.localeCompare(b.username));
    res.status(200);
    return res.json(users);
  } catch (ex) {
    res.status(500);
    res.json({ msg: 'Internal server error' });
    next(ex);
  }
};

// Update Open Status (Admin Access)
module.exports.updateOpenStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { openMode } = req.body;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found', status: false });
    }

    user.openMode = openMode;
    await user.save();

    return res.status(200).json({
      msg: 'Open status updated successfully',
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.makeUserAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.role = 'admin';
    await user.save();

    const token = jwt.sign(
      {
        username: user.username,
        _id: user._id,
        isAdmin: true,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: 300,
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
    });

    return res.status(200).json({ msg: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
    next(error);
  }
};

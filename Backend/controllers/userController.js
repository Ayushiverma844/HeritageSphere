const db = require("../config/db");


// ==========================================
// Admin
// Get All Users
// GET /admin/users
// ==========================================

const getUsers = async (req, res) => {

  try {

    let {

      page = 1,

      limit = 20,

      search = "",

      role = ""

    } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (isNaN(limit) || limit < 1) {
      limit = 20;
    }

    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";

    const values = [];

    // ==========================
    // Search
    // ==========================

    if (search) {

      whereClause += `

        AND (

          name LIKE ?

          OR email LIKE ?

          OR city LIKE ?

          OR state LIKE ?

          OR country LIKE ?

        )

      `;

      values.push(

        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`

      );

    }

    // ==========================
    // Role Filter
    // ==========================

    if (role) {

      whereClause += ` AND role=? `;

      values.push(role);

    }

    // ==========================
    // Count
    // ==========================

    const [countResult] = await db.query(

      `
      SELECT COUNT(*) AS total

      FROM users

      ${whereClause}
      `,

      values

    );

    const totalUsers = countResult[0].total;

    // ==========================
    // Users
    // ==========================

    const [users] = await db.query(

      `
      SELECT

        user_id,

        name,

        email,

        role,

        mobile_number,

        city,

        state,

        country,

        profile_image,

        created_at

      FROM users

      ${whereClause}

      ORDER BY created_at DESC

      LIMIT ?

      OFFSET ?
      `,

      [

        ...values,

        limit,

        offset

      ]

    );

    res.status(200).json({

      success: true,

      pagination: {

        currentPage: page,

        totalPages: Math.ceil(totalUsers / limit),

        totalUsers,

        limit,

        hasNextPage:
          page < Math.ceil(totalUsers / limit),

        hasPreviousPage:
          page > 1

      },

      users

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ==========================================
// Admin
// Get Single User
// GET /admin/users/:id
// ==========================================

const getUserById = async (req, res) => {

  try {

    const userId = req.params.id;

    const [user] = await db.query(

      `
      SELECT

        user_id,

        name,

        email,

        role,

        mobile_number,

        date_of_birth,

        city,

        state,

        country,

        profile_image,

        created_at,

        updated_at

      FROM users

      WHERE user_id=?
      `,

      [userId]

    );

    if (user.length === 0) {

      return res.status(404).json({

        success: false,

        message: "User not found."

      });

    }

    res.json({

      success: true,

      user: user[0]

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// ==========================================
// Super Admin
// Update User Role
// PATCH /admin/users/:id/role
// ==========================================

const updateUserRole = async (req, res) => {

  try {

    const currentUserId = req.user.id;

    const currentUserRole = req.user.role;

    const targetUserId = req.params.id;

    const { role } = req.body;

    // ==========================
    // Only Super Admin
    // ==========================

    if (currentUserRole !== "super_admin") {

      return res.status(403).json({

        success: false,

        message: "Only Super Admin can change user roles."

      });

    }

    // ==========================
    // Validation
    // ==========================

    if (!role) {

      return res.status(400).json({

        success: false,

        message: "Role is required."

      });

    }

    if (

      role !== "user" &&

      role !== "admin"

    ) {

      return res.status(400).json({

        success: false,

        message: "Invalid role."

      });

    }

    // ==========================
    // Cannot Change Own Role
    // ==========================

    if (

      Number(currentUserId) ===

      Number(targetUserId)

    ) {

      return res.status(403).json({

        success: false,

        message: "You cannot change your own role."

      });

    }

    // ==========================
    // Target User
    // ==========================

    const [users] = await db.query(

      `
      SELECT

        user_id,

        role,

        name

      FROM users

      WHERE user_id=?
      `,

      [targetUserId]

    );

    if (users.length === 0) {

      return res.status(404).json({

        success: false,

        message: "User not found."

      });

    }

    const targetUser = users[0];

    // ==========================
    // Super Admin Protection
    // ==========================

    if (

      targetUser.role === "super_admin"

    ) {

      return res.status(403).json({

        success: false,

        message: "Super Admin role cannot be modified."

      });

    }

    // ==========================
    // Already Same Role
    // ==========================

    if (

      targetUser.role === role

    ) {

      return res.status(400).json({

        success: false,

        message: `User is already ${role}.`

      });

    }

    // ==========================
    // Update
    // ==========================

    await db.query(

      `
      UPDATE users

      SET role=?

      WHERE user_id=?
      `,

      [

        role,

        targetUserId

      ]

    );

    res.json({

      success: true,

      message: `Role updated to ${role} successfully.`

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
// ==========================================
// Admin / Super Admin
// Delete User
// DELETE /admin/users/:id
// ==========================================

const deleteUser = async (req, res) => {

  try {

    const currentUserId = req.user.id;

    const currentUserRole = req.user.role;

    const targetUserId = req.params.id;

    // ==========================
    // Cannot Delete Yourself
    // ==========================

    if (

      Number(currentUserId) ===

      Number(targetUserId)

    ) {

      return res.status(403).json({

        success: false,

        message: "You cannot delete your own account."

      });

    }

    // ==========================
    // Target User
    // ==========================

    const [users] = await db.query(

      `
      SELECT

        user_id,

        name,

        role,

        profile_image

      FROM users

      WHERE user_id=?
      `,

      [targetUserId]

    );

    if (users.length === 0) {

      return res.status(404).json({

        success: false,

        message: "User not found."

      });

    }

    const targetUser = users[0];

    // ==========================
    // Admin Rules
    // ==========================

    if (currentUserRole === "admin") {

      if (targetUser.role === "admin") {

        return res.status(403).json({

          success: false,

          message: "Admins cannot delete other admins."

        });

      }

      if (targetUser.role === "super_admin") {

        return res.status(403).json({

          success: false,

          message: "Admins cannot delete Super Admin."

        });

      }

    }

    // ==========================
    // Super Admin Rules
    // ==========================

    if (

      currentUserRole === "super_admin" &&

      targetUser.role === "super_admin"

    ) {

      return res.status(403).json({

        success: false,

        message: "Super Admin cannot delete another Super Admin."

      });

    }

    // ==========================
    // Delete User
    // ==========================

    await db.query(

      `
      DELETE FROM users

      WHERE user_id=?
      `,

      [targetUserId]

    );

    // ==========================
    // Optional:
    // Delete Cloudinary Profile Image
    // ==========================

    /*
    if (targetUser.public_id) {

      await deleteImage(
        targetUser.public_id
      );

    }
    */

    res.json({

      success: true,

      message: "User deleted successfully."

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};
module.exports = {

  getUsers,

  getUserById,

  updateUserRole,

  deleteUser

};
import api from "../api/api";

// ======================================
// Get All Users
// ======================================

const getUsers = async (params = {}) => {

  const response = await api.get(

    "/users/admin",

    {
      params,
    }

  );

  return response.data;

};

// ======================================
// Get Single User
// ======================================

const getUserById = async (userId) => {

  const response = await api.get(

    `/users/admin/${userId}`

  );

  return response.data;

};

// ======================================
// Update User Role
// ======================================

const updateUserRole = async (

  userId,

  role

) => {

  const response = await api.patch(

    `/users/admin/${userId}/role`,

    {

      role,

    }

  );

  return response.data;

};

// ======================================
// Delete User
// ======================================

const deleteUser = async (

  userId

) => {

  const response = await api.delete(

    `/users/admin/${userId}`

  );

  return response.data;

};

export default {

  getUsers,

  getUserById,

  updateUserRole,

  deleteUser,

};
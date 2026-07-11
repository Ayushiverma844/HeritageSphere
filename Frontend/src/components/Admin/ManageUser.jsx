import React, {

  useEffect,

  useState,

} from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {

  ArrowLeft,

  Search,

  Shield,

  Trash2,

  UserCog,

  Eye,
  
  X ,

} from "lucide-react";

import userService from "../../services/userService";

const ManageUsers = () => {

  // ==========================================
  // Users
  // ==========================================

  const [users, setUsers] = useState([]);

  // ==========================================
  // Loading
  // ==========================================

  const [loading, setLoading] = useState(false);

  // ==========================================
  // Search
  // ==========================================

  const [search, setSearch] = useState("");

  // ==========================================
  // Filters
  // ==========================================

  const [roleFilter, setRoleFilter] = useState("");

  // ==========================================
  // Pagination
  // ==========================================

  const [pagination, setPagination] = useState({

    currentPage: 1,

    totalPages: 1,

    totalUsers: 0,

    hasNextPage: false,

    hasPreviousPage: false,

  });

  // ==========================================
  // Selected User
  // ==========================================

  const [selectedUser, setSelectedUser] =

    useState(null);

  // ==========================================
  // Change Role Modal
  // ==========================================

  const [showRoleModal, setShowRoleModal] =

    useState(false);

  // ==========================================
  // Delete Modal
  // ==========================================

  const [showDeleteModal, setShowDeleteModal] =

    useState(false);

  // ==========================================
  // View Modal
  // ==========================================

  const [showViewModal, setShowViewModal] =

    useState(false);

  // ==========================================
  // Current Selected Role
  // ==========================================

  const [newRole, setNewRole] =

    useState("");

  // ==========================================
  // Saving
  // ==========================================

  const [saving, setSaving] = useState(false);

  // ==========================================
  // Load Users
  // ==========================================

  const loadUsers = async (

    page = 1

  ) => {

    try {

      setLoading(true);

      const res = await userService.getUsers({

        page,

        limit: 20,

        search,

        role: roleFilter,

      });

      if (res.success) {

        setUsers(res.users);

        setPagination(res.pagination);

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        "Unable to load users."

      );

    }

    finally {

      setLoading(false);

    }

  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {

    loadUsers();

  }, []);

  // ==========================================
  // Search / Filter
  // ==========================================

  useEffect(() => {

    const timer = setTimeout(() => {

      loadUsers(1);

    }, 400);

    return () => clearTimeout(timer);

  }, [

    search,

    roleFilter,

  ]);

  // ==========================================
  // View User
  // ==========================================

  const handleView = async (

    userId

  ) => {

    try {

      const res =

        await userService.getUserById(

          userId

        );

      if (res.success) {

        setSelectedUser(res.user);

        setShowViewModal(true);

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        "Unable to load user."

      );

    }

  };

  // ==========================================
  // Open Role Modal
  // ==========================================

  const handleRoleModal = (

    user

  ) => {

    setSelectedUser(user);

    setNewRole(user.role);

    setShowRoleModal(true);

  };

  // ==========================================
  // Update Role
  // ==========================================

  const handleUpdateRole = async () => {

    try {

      setSaving(true);

      const res =

        await userService.updateUserRole(

          selectedUser.user_id,

          newRole

        );

      if (res.success) {

        toast.success(

          res.message

        );

        setShowRoleModal(false);

        loadUsers(

          pagination.currentPage

        );

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.message ||

        "Unable to update role."

      );

    }

    finally {

      setSaving(false);

    }

  };

  // ==========================================
  // Open Delete Modal
  // ==========================================

  const handleDeleteModal = (

    user

  ) => {

    setSelectedUser(user);

    setShowDeleteModal(true);

  };

  // ==========================================
  // Delete User
  // ==========================================

  const handleDelete = async () => {

    try {

      setSaving(true);

      const res =

        await userService.deleteUser(

          selectedUser.user_id

        );

      if (res.success) {

        toast.success(

          res.message

        );

        setShowDeleteModal(false);

        loadUsers(

          pagination.currentPage

        );

      }

    }

    catch (error) {

      console.log(error);

      toast.error(

        error.response?.data?.message ||

        "Unable to delete user."

      );

    }

    finally {

      setSaving(false);

    }

  };
  return (

<div className="min-h-screen px-6 py-10 text-white">

  {/* ==========================================
      Header
  ========================================== */}

  <Link

    to="/admin"

    className="

      inline-flex

      items-center

      gap-2

      text-gray-300

      hover:text-white

      mb-6

      transition

    "

  >

    <ArrowLeft size={18} />

    Back to Dashboard

  </Link>

  <div className="flex justify-between items-center mb-8">

    <div>

      <h1 className="text-4xl font-bold">

        Manage Users

      </h1>

      <p className="text-gray-400 mt-2">

        View, manage and control user accounts.

      </p>

    </div>

  </div>

  {/* ==========================================
      Filters
  ========================================== */}

  <div className="

      rounded-3xl

      bg-white/5

      border

      border-white/10

      p-6

      mb-8

  ">

    <div className="grid lg:grid-cols-2 gap-4">

      {/* Search */}

      <div className="relative">

        <Search

          className="absolute left-4 top-4"

          size={18}

        />

        <input

          type="text"

          placeholder="Search by name or email..."

          value={search}

          onChange={(e)=>

            setSearch(e.target.value)

          }

          className="

            w-full

            pl-11

            pr-4

            py-3

            rounded-xl

            bg-white/5

            border

            border-white/10

          "

        />

      </div>

      {/* Role */}

      <select

        value={roleFilter}

        onChange={(e)=>

          setRoleFilter(e.target.value)

        }

        className="

          rounded-xl

          bg-[#111827]

          border

          border-white/10

          px-4

          py-3

        "

      >

        <option value="">

          All Roles

        </option>

        <option value="user">

          User

        </option>

        <option value="admin">

          Admin

        </option>

        <option value="super_admin">

          Super Admin

        </option>

      </select>

    </div>

  </div>

  {/* ==========================================
      Users
  ========================================== */}

  <div className="

    rounded-3xl

    bg-white/5

    border

    border-white/10

    p-6

  ">

    <div className="flex justify-between items-center mb-6">

      <div>

        <h2 className="text-2xl font-semibold">

          Users

        </h2>

        <p className="text-gray-400 mt-1">

          Total Users : {pagination.totalUsers}

        </p>

      </div>

    </div>

    {loading ? (

      <div className="text-center py-20 text-gray-400">

        Loading Users...

      </div>

    ) : users.length===0 ? (

      <div className="text-center py-20 text-gray-400">

        No Users Found.

      </div>

    ) : (

      <>

      <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead>

          <tr className="border-b border-white/10">

            <th className="text-left py-4">

              User

            </th>

            <th className="text-left">

              Email

            </th>

            <th className="text-left">

              Role

            </th>

            <th className="text-left">

              Joined

            </th>

            <th className="text-center">

              Actions

            </th>

          </tr>

        </thead>

        <tbody>

          {users.map((user)=>(

          <tr

            key={user.user_id}

            className="border-b border-white/5"

          >

            {/* User */}

            <td className="py-5">

              <div className="flex items-center gap-3">

                <img

                  src={

                    user.profile_image ||

                    "https://ui-avatars.com/api/?name="+

                    encodeURIComponent(user.name)

                  }

                  alt=""

                  className="

                    h-12

                    w-12

                    rounded-full

                    object-cover

                  "

                />

                <div>

                  <p className="font-semibold">

                    {user.name}

                  </p>

                  <p className="text-sm text-gray-400">

                    #{user.user_id}

                  </p>

                </div>

              </div>

            </td>

            {/* Email */}

            <td>

              {user.email}

            </td>

            {/* Role */}

            <td>

              <span

                className={`

                  px-3

                  py-1

                  rounded-full

                  text-sm

                  font-medium

                  ${

                    user.role==="super_admin"

                    ? "bg-red-500/20 text-red-400"

                    : user.role==="admin"

                    ? "bg-yellow-500/20 text-yellow-400"

                    : "bg-green-500/20 text-green-400"

                  }

                `}

              >

                {user.role}

              </span>

            </td>

            {/* Joined */}

            <td>

              {

                new Date(

                  user.created_at

                ).toLocaleDateString()

              }

            </td>

            {/* Actions */}

            <td>

              <div className="

                flex

                justify-center

                gap-2

              ">

                <button

                  onClick={()=>

                    handleView(user.user_id)

                  }

                  className="

                    p-2

                    rounded-lg

                    bg-blue-600

                    hover:bg-blue-700

                  "

                >

                  <Eye size={18}/>

                </button>

                <button

                  onClick={()=>

                    handleRoleModal(user)

                  }

                  className="

                    p-2

                    rounded-lg

                    bg-yellow-600

                    hover:bg-yellow-700

                  "

                >

                  <UserCog size={18}/>

                </button>

                <button

                  onClick={()=>

                    handleDeleteModal(user)

                  }

                  className="

                    p-2

                    rounded-lg

                    bg-red-600

                    hover:bg-red-700

                  "

                >

                  <Trash2 size={18}/>

                </button>

              </div>

            </td>

          </tr>

          ))}

        </tbody>

      </table>

      </div>

      {/* Pagination */}

      <div className="

        flex

        justify-center

        items-center

        gap-4

        mt-10

      ">

        <button

          disabled={!pagination.hasPreviousPage}

          onClick={()=>

            loadUsers(

              pagination.currentPage-1

            )

          }

          className="

            px-5

            py-2

            rounded-lg

            bg-white/10

            disabled:opacity-40

          "

        >

          Previous

        </button>

        <span>

          Page {pagination.currentPage}

          {" "}of{" "}

          {pagination.totalPages}

        </span>

        <button

          disabled={!pagination.hasNextPage}

          onClick={()=>

            loadUsers(

              pagination.currentPage+1

            )

          }

          className="

            px-5

            py-2

            rounded-lg

            bg-white/10

            disabled:opacity-40

          "

        >

          Next

        </button>

      </div>

      </>

    )}

  </div>
        {/* ==========================================
          View User Modal
      ========================================== */}

      {showViewModal && selectedUser && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="

            w-full

            max-w-2xl

            rounded-3xl

            bg-[#111827]

            border

            border-white/10

            p-8

          ">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-2xl font-bold">

                User Details

              </h2>

              <button

               onClick={() => {
  setShowViewModal(false);
  setSelectedUser(null);
}}

                className="text-gray-400 hover:text-white"

              >

                <X size={22} />

              </button>

            </div>

            <div className="flex gap-6">

              <img

                src={
                  selectedUser.profile_image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedUser.name
                  )}`
                }

                alt=""

                className="

                  w-28

                  h-28

                  rounded-full

                  object-cover

                "

              />

              <div className="grid grid-cols-2 gap-x-10 gap-y-3">

                <div>

                  <p className="text-gray-400">

                    Name

                  </p>

                  <p>{selectedUser.name}</p>

                </div>

                <div>

                  <p className="text-gray-400">

                    Email

                  </p>

                  <p>{selectedUser.email}</p>

                </div>

                <div>

                  <p className="text-gray-400">

                    Role

                  </p>

                  <p>{selectedUser.role}</p>

                </div>

                <div>

                  <p className="text-gray-400">

                    Mobile

                  </p>

                  <p>

                    {selectedUser.mobile_number || "-"}

                  </p>

                </div>

                <div>

                  <p className="text-gray-400">

                    City

                  </p>

                  <p>{selectedUser.city || "-"}</p>

                </div>

                <div>

                  <p className="text-gray-400">

                    State

                  </p>

                  <p>{selectedUser.state || "-"}</p>

                </div>

                <div>

                  <p className="text-gray-400">

                    Country

                  </p>

                  <p>{selectedUser.country || "-"}</p>

                </div>

                <div>

                  <p className="text-gray-400">

                    DOB

                  </p>

                  <p>

                    {selectedUser.date_of_birth || "-"}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ==========================================
          Role Modal
      ========================================== */}

      {showRoleModal && selectedUser && (

        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

          <div className="

            w-full

            max-w-md

            rounded-3xl

            bg-[#111827]

            border

            border-white/10

            p-8

          ">

            <h2 className="text-2xl font-bold mb-6">

              Change User Role

            </h2>

            <p className="text-gray-400 mb-6">

              {selectedUser.name}

            </p>

            <select

             value={newRole}

              onChange={(e)=>

                setNewRole(e.target.value)

              }

              className="

                w-full

                rounded-xl

               bg-[#111827]

          border

          border-white/10

                px-4

                py-3

                mb-8

              "

            >

              <option value="user">

                User

              </option>

              <option value="admin">

                Admin

              </option>

            </select>

            <div className="flex gap-4">

              <button

                onClick={handleUpdateRole}

                className="

                  flex-1

                  bg-yellow-500

                  text-black

                  rounded-xl

                  py-3

                  font-semibold

                "

              >

                Save

              </button>

              <button

                onClick={() => setShowRoleModal(false)}

                className="

                  flex-1

                  bg-red-500

                  rounded-xl

                  py-3

                "

              >

                Cancel

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ==========================================
          Delete Modal
      ========================================== */}

      {showDeleteModal && selectedUser && (

        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

          <div className="

            w-full

            max-w-md

            rounded-3xl

            bg-[#111827]

            border

            border-white/10

            p-8

            text-center

          ">

            <Trash2

              size={50}

              className="mx-auto text-red-500 mb-5"

            />

            <h2 className="text-2xl font-bold mb-3">

              Delete User

            </h2>

            <p className="text-gray-400 mb-8">

              Are you sure you want to delete

              <br />

              <span className="text-white font-semibold">

                {selectedUser.name}

              </span>

              ?

            </p>

            <div className="flex gap-4">

              <button

                onClick={handleDelete}

                className="

                  flex-1

                  bg-red-600

                  rounded-xl

                  py-3

                  font-semibold

                "

              >

                Delete

              </button>

              <button

                onClick={() => {
    setShowDeleteModal(false);
    setSelectedUser(null);
}

                }

                className="

                  flex-1

                  bg-white/10

                  rounded-xl

                  py-3

                "

              >

                Cancel

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

);

};

export default ManageUsers;
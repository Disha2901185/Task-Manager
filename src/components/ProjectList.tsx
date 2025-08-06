import { useEffect, useState } from "react";
import { api } from "../apiConfig/api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { MdEdit, MdDelete } from "react-icons/md";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
};

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const defaultForm: Partial<Task> = {
  title: "",
  description: "",
  status: "todo",
  dueDate: getCurrentDateTimeLocal(),
};

const ProjectList = () => {
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>(defaultForm);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Filtering states
  const [statusFilter, setStatusFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState(false);
  const [overdueFilter, setOverdueFilter] = useState(false);
  const [statusFilterLabel, setStatusFilterLabel] = useState("Status");
  const [dueDateFilterLabel, setDueDateFilterLabel] = useState("Due Date");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [TaskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    const fetchFilteredTasks = async () => {
      const res = await api.post("/task/get", {
        status: statusFilter,
        dueToday: dueDateFilter,
        overdue: overdueFilter,
      });
      setTasks(res.data?.tasks || []);
    };
    fetchFilteredTasks();
  }, [statusFilter, dueDateFilter, overdueFilter]);

  const toggleTask = (TaskId: string) => {
    setOpenTaskId((prevId) => (prevId === TaskId ? null : TaskId));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: string) => {
    try {
      await api.post(`/task/delete/${id}`);
      toast.success("Task deleted successfully!");

      const res = await api.post("/task/get", {
        status: statusFilter,
        dueToday: dueDateFilter,
        overdue: overdueFilter,
      });
      setTasks(res.data?.tasks || []);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      toast.error("Failed to delete the task.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.description) {
        toast.error("Title and description are required");
        return;
      }

      if (editMode && formData._id) {
        await api.post(`/task/update`, { ...formData, id: formData._id });
        toast.success("Task updated successfully!");
      } else {
        await api.post("/task/create", formData);
        toast.success("Task created successfully!");
      }

      setFormData(defaultForm);
      setEditMode(false);
      setShowModal(false);

      const res = await api.post("/task/get", {
        status: statusFilter,
        dueToday: dueDateFilter,
        overdue: overdueFilter,
      });
      setTasks(res.data?.tasks || []);
    } catch (error) {
      toast.error("Something went wrong while saving the task.");
    }
  };

  const handleEdit = (Task: Task) => {
    setFormData(Task);
    setEditMode(true);
    setShowModal(true);
  };

  const handleFilter = (filterType: string) => {
    switch (filterType) {
      case "all":
        setStatusFilter("");
        setDueDateFilter(false);
        setOverdueFilter(false);
        setStatusFilterLabel("All");
        setDueDateFilterLabel("Due Date");
        break;
      case "pending":
        setStatusFilter("todo");
        setStatusFilterLabel("Pending");
        break;
      case "inProgress":
        setStatusFilter("in-progress");
        setStatusFilterLabel("In Progress");
        break;
      case "completed":
        setStatusFilter("done");
        setStatusFilterLabel("Completed");
        break;
      case "dueToday":
        setDueDateFilter(true);
        setOverdueFilter(false);
        setDueDateFilterLabel("Due Today");
        break;
      case "overdue":
        setDueDateFilter(false);
        setOverdueFilter(true);
        setDueDateFilterLabel("Overdue");
        break;
      default:
        setStatusFilter("");
        setDueDateFilter(false);
        setOverdueFilter(false);
        setStatusFilterLabel("Status");
        setDueDateFilterLabel("Due Date");
        break;
    }
  };

  const getLocalDateTimeForInput = (utcString: any): any => {
    const date = new Date(utcString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  return (
    <>
      <Navbar />
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <h1 className="text-2xl font-bold">Your Tasks</h1>
<div className="flex flex-wrap gap-4 justify-between items-center">
          <button
            onClick={() => {
              setFormData(defaultForm);
              setEditMode(false);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Task
          </button>

          {/* Status Filter */}
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
              {statusFilterLabel}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <button onClick={() => handleFilter("all")}
                      className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} block w-full text-left px-4 py-2 text-sm`}>
                      All
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button onClick={() => handleFilter("pending")}
                      className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} block w-full text-left px-4 py-2 text-sm`}>
                      Pending
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button onClick={() => handleFilter("inProgress")}
                      className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} block w-full text-left px-4 py-2 text-sm`}>
                      In Progress
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button onClick={() => handleFilter("completed")}
                      className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} block w-full text-left px-4 py-2 text-sm`}>
                      Completed
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>

          {/* Due Date Filter */}
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
              {dueDateFilterLabel}
              <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <button onClick={() => handleFilter("dueToday")}
                      className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} block w-full text-left px-4 py-2 text-sm`}>
                      Due Today
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button onClick={() => handleFilter("overdue")}
                      className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} block w-full text-left px-4 py-2 text-sm`}>
                      Overdue
                    </button>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
          </div>
        </div>

        {/* Task List */}
       <div className="h-[calc(100vh-180px)] overflow-y-auto px-2">
  {Tasks.length !== 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Tasks.map((Task) => {
        const isOpen = openTaskId === Task._id;

        // Color mapping for statuses
        const getStatusStyles = (status:any) => {
          switch (status.toLowerCase()) {
            case "todo":
              return "bg-red-200 text-red-800";
            case "in-progress":
              return "bg-yellow-200 text-yellow-800";
            case "done":
              return "bg-green-200 text-green-800";
            default:
              return "bg-gray-100 text-gray-600";
          }
        };

        return (
          <div key={Task._id} className="border rounded-lg overflow-hidden shadow-md bg-white">
            <div
              onClick={() => toggleTask(Task._id)}
              className="p-4 flex flex-col justify-between h-full cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center mb-2">
                {/* Status badge */}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${getStatusStyles(
                    Task.status
                  )}`}
                >
                  {Task.status}
                </span>

                {/* Due Date */}
                {Task.dueDate && (
                  <span className="text-xs text-gray-500">
                    Due: {new Date(Task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Title and Description */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-black mb-1">{Task.title}</h2>
                <p className="text-sm text-gray-600">{Task.description}</p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 items-center justify-end mt-4">
                <MdEdit
                  size={24}
                  className="text-blue-900 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(Task);
                  }}
                />
                <MdDelete
                  size={24}
                  className="text-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTaskToDelete(Task);
                    setDeleteModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="my-28 text-lg font-semibold mb-4 text-white text-center">
      No Tasks Available
    </div>
  )}
</div>



        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h2 className="text-lg font-semibold mb-4 text-black">
                {editMode ? "Edit Task" : "Add New Task"}
              </h2>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                placeholder="Task Title"
                className="border px-3 py-2 w-full mb-2 rounded text-black"
              />
              <input
                type="datetime-local"
                name="dueDate"
                value={getLocalDateTimeForInput(formData.dueDate)}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: new Date(e.target.value).toISOString() }))}
                className="border px-3 py-2 w-full mb-2 rounded text-black"
              />
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Task Description"
                className="border px-3 py-2 w-full mb-2 rounded text-black"
              />
              <select
                name="status"
                value={formData.status || "Pending"}
                onChange={handleChange}
                className="border px-3 py-2 w-full mb-4 rounded text-black"
              >
                <option value="todo">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditMode(false);
                    setFormData(defaultForm);
                  }}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {deleteModalOpen && TaskToDelete && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{TaskToDelete.title}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setTaskToDelete(null);
                }}
                className="text-gray-700 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={(e) => { handleDelete(TaskToDelete._id) }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProjectList;

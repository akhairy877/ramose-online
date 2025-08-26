import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getAllTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  subjects,
  getCurrentVisionBoardData,
} from "@shared/data";
import { Admin, Teacher, Subject } from "@shared/types";
import { cn } from "@/lib/utils";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export default function AdminDashboard() {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    subjects: [] as string[],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = localStorage.getItem("currentAdmin");
    if (adminData) {
      setCurrentAdmin(JSON.parse(adminData));
      refreshTeachers();
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  const refreshTeachers = () => {
    setTeachers(getAllTeachers());
  };

  const showFeedback = (message: string, duration = 3000) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(""), duration);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentAdmin");
    navigate("/");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      password: "",
      subjects: [],
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      username: teacher.username,
      password: teacher.password,
      subjects: teacher.subjects,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleAddTeacher = () => {
    if (!formData.name || !formData.username || !formData.password) {
      showFeedback("Please fill in all required fields");
      return;
    }

    const success = addTeacher({
      name: formData.name,
      username: formData.username,
      password: formData.password,
      subjects: formData.subjects,
    });

    if (success) {
      refreshTeachers();
      setIsAddDialogOpen(false);
      resetForm();
      showFeedback("Teacher added successfully");
    } else {
      showFeedback("Failed to add teacher. Username may already exist.");
    }
  };

  const handleUpdateTeacher = () => {
    if (
      !selectedTeacher ||
      !formData.name ||
      !formData.username ||
      !formData.password
    ) {
      showFeedback("Please fill in all required fields");
      return;
    }

    const success = updateTeacher(selectedTeacher.id, {
      name: formData.name,
      username: formData.username,
      password: formData.password,
      subjects: formData.subjects,
    });

    if (success) {
      refreshTeachers();
      setIsEditDialogOpen(false);
      setSelectedTeacher(null);
      resetForm();
      showFeedback("Teacher updated successfully");
    } else {
      showFeedback("Failed to update teacher. Username may already exist.");
    }
  };

  const handleDeleteTeacher = () => {
    if (!selectedTeacher) return;

    const success = deleteTeacher(selectedTeacher.id);

    if (success) {
      refreshTeachers();
      setIsDeleteDialogOpen(false);
      setSelectedTeacher(null);
      showFeedback("Teacher deleted successfully");
    } else {
      showFeedback("Failed to delete teacher");
    }
  };

  const handleSubjectToggle = (subjectId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, subjectId]
        : prev.subjects.filter((id) => id !== subjectId),
    }));
  };

  const getSubjectDisplay = (subjectIds: string[]) => {
    return subjects
      .filter((s) => subjectIds.includes(s.id))
      .map((s) => (
        <Badge key={s.id} className={cn("text-white mr-1 mb-1", s.color)}>
          {s.icon} {s.name}
        </Badge>
      ));
  };

  const data = getCurrentVisionBoardData();

  if (!currentAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-red-500 to-orange-500">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row lg:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                🔐 Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Welcome, {currentAdmin.name}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-orange-200 text-orange-600"
              >
                👁️ View Vision Board
              </Button>
              <Button
                onClick={() => navigate("/teacher/login")}
                variant="outline"
                className="border-orange-200 text-orange-600"
              >
                👨‍🏫 Teacher Login
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 text-red-600"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-6">
        {/* Feedback Message */}
        {feedbackMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              {feedbackMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">
                    {data.students.length}
                  </div>
                  <div className="text-sm text-blue-600">Total Students</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <GraduationCap className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {teachers.length}
                  </div>
                  <div className="text-sm text-green-600">Total Teachers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-100 to-purple-200 border-2 border-purple-300">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <BookOpen className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-700">
                    {subjects.length}
                  </div>
                  <div className="text-sm text-purple-600">
                    Available Subjects
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teacher Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-orange-700 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Teacher Management
              </CardTitle>
              <Button
                onClick={openAddDialog}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Assigned Subjects</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        {teacher.name}
                      </TableCell>
                      <TableCell>{teacher.username}</TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {teacher.password}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getSubjectDisplay(teacher.subjects)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(teacher)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => openDeleteDialog(teacher)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {teachers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500 py-8"
                      >
                        No teachers found. Add your first teacher to get
                        started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Teacher Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Create a new teacher account and assign subjects.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="add-name">Full Name</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter teacher's full name"
                />
              </div>
              <div>
                <Label htmlFor="add-username">Username</Label>
                <Input
                  id="add-username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="Enter username for login"
                />
              </div>
              <div>
                <Label htmlFor="add-password">Password</Label>
                <Input
                  id="add-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label>Assigned Subjects</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`add-subject-${subject.id}`}
                        checked={formData.subjects.includes(subject.id)}
                        onCheckedChange={(checked) =>
                          handleSubjectToggle(subject.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`add-subject-${subject.id}`}
                        className="flex items-center gap-2"
                      >
                        <span>{subject.icon}</span>
                        {subject.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTeacher}>Add Teacher</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Teacher Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
              <DialogDescription>
                Update teacher information and subject assignments.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter teacher's full name"
                />
              </div>
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="Enter username for login"
                />
              </div>
              <div>
                <Label htmlFor="edit-password">Password</Label>
                <Input
                  id="edit-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label>Assigned Subjects</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`edit-subject-${subject.id}`}
                        checked={formData.subjects.includes(subject.id)}
                        onCheckedChange={(checked) =>
                          handleSubjectToggle(subject.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`edit-subject-${subject.id}`}
                        className="flex items-center gap-2"
                      >
                        <span>{subject.icon}</span>
                        {subject.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateTeacher}>Update Teacher</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Teacher Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Teacher</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedTeacher?.name}? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteTeacher}>
                Delete Teacher
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

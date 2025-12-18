import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { isLoggedIn, logout } from "@/lib/auth";
import { getPosts, savePost, deletePost, Post } from "@/lib/posts";
import { LogOut, Plus, Trash2, FileText, Calendar } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
      return;
    }
    setPosts(getPosts());
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date.trim() || !body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newPost = savePost({ title: title.trim(), date, body: body.trim() });
    setPosts([newPost, ...posts]);
    setTitle("");
    setDate("");
    setBody("");

    toast({
      title: "Success",
      description: "Post created successfully!",
    });
  };

  const handleDelete = (id: string) => {
    deletePost(id);
    setPosts(posts.filter(p => p.id !== id));
    toast({
      title: "Deleted",
      description: "Post removed successfully",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">
            <span className="gradient-text">AustinstayerFX</span>
            <span className="text-muted-foreground ml-2">Admin</span>
          </h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-border text-foreground hover:bg-secondary"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Create Post Form */}
        <Card className="glass-card border-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Plus className="w-5 h-5 text-primary" />
              Create New Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">Title</Label>
                  <Input
                    id="title"
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-foreground">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="body" className="text-foreground">Body</Label>
                <Textarea
                  id="body"
                  placeholder="Write your post content here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Posts ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <Card className="glass-card border-border">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No posts yet. Create your first post above!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="glass-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </p>
                      <p className="text-sm text-foreground/80 mt-2 line-clamp-2">{post.body}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

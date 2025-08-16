"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  MessageCircle,
  Plus,
  User,
  Clock,
  MessageSquare,
} from "lucide-react";
import { createClient } from "../../../supabase/client";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  replies: number;
}

interface Reply {
  id: string;
  postId: string;
  content: string;
  author: string;
  created_at: string;
}

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "How to increase customer engagement with loyalty cards?",
      content:
        "I've been using LOYO for a month now, but I'm not seeing the engagement I expected. Any tips?",
      author: "CafeOwner123",
      created_at: "2024-01-15T10:30:00Z",
      replies: 3,
    },
    {
      id: "2",
      title: "Best practices for QR code placement",
      content:
        "Where do you place your QR codes for maximum visibility? Counter, receipts, or both?",
      author: "RetailPro",
      created_at: "2024-01-14T15:45:00Z",
      replies: 2,
    },
    {
      id: "3",
      title: "Reward ideas that actually work",
      content:
        "What rewards have you found most effective for bringing customers back?",
      author: "SmallBizOwner",
      created_at: "2024-01-13T09:20:00Z",
      replies: 3,
    },
  ]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");
  const [replies, setReplies] = useState<Reply[]>([
    {
      id: "r1",
      postId: "1",
      content:
        "I found that offering a welcome bonus really helps! Give customers their first stamp just for signing up. Also, make sure your staff mentions the loyalty program during checkout.",
      author: "BaristaLife",
      created_at: "2024-01-15T14:20:00Z",
    },
    {
      id: "r2",
      postId: "1",
      content:
        "Try running limited-time promotions like 'double stamp Fridays' or seasonal rewards. It creates urgency and gets people excited about coming back.",
      author: "LocalBizGuru",
      created_at: "2024-01-15T16:45:00Z",
    },
    {
      id: "r3",
      postId: "1",
      content:
        "Don't forget about the analytics! Check which times of day you get the most scans and adjust your promotions accordingly. The data really helps.",
      author: "DataDrivenCafe",
      created_at: "2024-01-16T09:15:00Z",
    },
    {
      id: "r4",
      postId: "2",
      content:
        "I put mine right at the register where customers pay, and also include a small QR code on receipts. The counter placement gets about 80% of my scans.",
      author: "ShopOwnerSarah",
      created_at: "2024-01-14T18:30:00Z",
    },
    {
      id: "r5",
      postId: "2",
      content:
        "Table tents work great for restaurants! Customers have time to scan while they wait for food. Just make sure the QR code is big enough to scan easily.",
      author: "RestaurantMike",
      created_at: "2024-01-15T12:10:00Z",
    },
    {
      id: "r6",
      postId: "3",
      content:
        "Free items work best for us - every 10th coffee free. But I also do percentage discounts for higher-value customers, like 15% off after 5 visits.",
      author: "CoffeeChainOwner",
      created_at: "2024-01-13T15:25:00Z",
    },
    {
      id: "r7",
      postId: "3",
      content:
        "Experience rewards are underrated! We offer 'skip the line' privileges for loyal customers during busy hours. They love the VIP treatment.",
      author: "BusyBakery",
      created_at: "2024-01-14T08:40:00Z",
    },
    {
      id: "r8",
      postId: "3",
      content:
        "Seasonal rewards keep things fresh. Right now we're doing 'buy 8 hot chocolates, get a free holiday mug'. Customers love limited-time offers.",
      author: "SeasonalSpecialist",
      created_at: "2024-01-14T20:55:00Z",
    },
  ]);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: user?.email?.split("@")[0] || "Anonymous",
      created_at: new Date().toISOString(),
      replies: 0,
    };
    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "" });
    setShowNewPost(false);
  };

  const handleSubmitReply = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const reply: Reply = {
      id: Date.now().toString(),
      postId,
      content: newReply,
      author: user?.email?.split("@")[0] || "Anonymous",
      created_at: new Date().toISOString(),
    };
    setReplies([...replies, reply]);
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, replies: post.replies + 1 } : post,
      ),
    );
    setNewReply("");
    setSelectedPost(null);
  };

  const getPostReplies = (postId: string) => {
    return replies.filter((reply) => reply.postId === postId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Join the LOYO Community
          </h1>
          <p className="text-gray-600 mb-8">
            Connect with other business owners, share experiences, and get help
            with your loyalty programs.
          </p>
          <div className="space-y-3">
            <Link href="/sign-up">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                Sign Up to Join
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">
                Already have an account? Sign In
              </Button>
            </Link>
          </div>
          <div className="mt-8">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="w-full border-b border-blue-200 bg-white/95 backdrop-blur-md py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/images/loyo-logo-new.png"
              alt="LOYO Logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              LOYO
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.email?.split("@")[0]}
            </span>
            <Link href="/">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                LOYO Community Forum
              </h1>
              <p className="text-gray-600">
                Connect with fellow business owners and share your experiences
              </p>
            </div>
            <Button
              onClick={() => setShowNewPost(!showNewPost)}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>

          {/* New Post Form */}
          {showNewPost && (
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    placeholder="What's your question or topic?"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    placeholder="Share your thoughts, questions, or experiences..."
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                  >
                    Post
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewPost(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => {
              const postReplies = getPostReplies(post.id);
              const isExpanded = selectedPost === post.id;

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedPost(isExpanded ? null : post.id)
                      }
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.replies} replies</span>
                    </button>
                  </div>

                  {/* Replies Section */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="space-y-4 mb-4">
                        {postReplies.map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                              <User className="w-3 h-3" />
                              <span className="font-medium">
                                {reply.author}
                              </span>
                              <Clock className="w-3 h-3 ml-2" />
                              <span>{formatDate(reply.created_at)}</span>
                            </div>
                            <p className="text-gray-700">{reply.content}</p>
                          </div>
                        ))}
                      </div>

                      {/* Reply Form */}
                      <form
                        onSubmit={(e) => handleSubmitReply(e, post.id)}
                        className="space-y-3"
                      >
                        <Textarea
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="Share your thoughts or advice..."
                          rows={3}
                          required
                        />
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                          >
                            Reply
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(null);
                              setNewReply("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500">
                Be the first to start a conversation in the community!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

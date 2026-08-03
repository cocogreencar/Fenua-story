// src/components/RichTextBox.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import { Box, Paper, ToggleButton, Tooltip } from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

export default function RichTextBox({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      BulletList,
      OrderedList,
      Heading.configure({ levels: [1, 2, 3] }),
      TextStyle,
      Color,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Toolbar */}
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          gap: 1,
          p: 1,
          mb: 1,
          borderRadius: 1,
          bgcolor: "background.default",
        }}
      >
        <Tooltip title="Bold">
          <ToggleButton
            selected={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Italic">
          <ToggleButton
            selected={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Bullet list">
          <ToggleButton
            selected={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Numbered list">
          <ToggleButton
            selected={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon />
          </ToggleButton>
        </Tooltip>
      </Paper>

      {/* Editor Area */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 1,
          minHeight: 200,
          "& .ProseMirror": {
            minHeight: 180,
            outline: "none",
            fontSize: 16,
            lineHeight: 1.5,
            "& p": { margin: "4px 0" },
            "& ul, & ol": { margin: "4px 0", paddingLeft: "20px" },
            "& li": { margin: "2px 0" },
          },
          "&:focus-within": {
            borderColor: "primary.main",
            boxShadow: 3,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Paper>
    </Box>
  );
}

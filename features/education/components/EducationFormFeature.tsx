"use client";

import { useEducationForm } from "../hooks/useEducationForm";
import type { FormFields } from "../hooks/useEducationForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FormLoader } from "@/components/ui/loading";
import { useState, useRef, useEffect } from "react";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { BackButton } from "@/components/common/BackButton";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/components/ui/Toast";
import { createPortal } from "react-dom";

interface EducationFormFeatureProps {
  readonly articleId?: string;
}

export function EducationFormFeature({ articleId }: EducationFormFeatureProps) {
  const { showToast } = useToast();
  const {
    fields,
    isLoading,
    isSaving,
    errors,
    handleChange: baseHandleChange,
    save,
    cancel,
  } = useEducationForm(articleId);

  const [isDirty, setIsDirty] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const handleChange = (key: keyof FormFields, val: string | number) => {
    baseHandleChange(key, val);
    setIsDirty(true);
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setIsCancelOpen(true);
    } else {
      cancel();
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Combobox category states
  const [categoriesList, setCategoriesList] = useState<string[]>([
    "Diet & Nutrisi",
    "Aktivitas Fisik",
    "Manajemen Obat",
    "Kesehatan Mental",
  ]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync category from loaded article into list
  useEffect(() => {
    if (fields.category && !categoriesList.includes(fields.category)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoriesList((prev) => [...prev, fields.category]);
    }
  }, [fields.category, categoriesList]);

  // Fetch backend categories on mount
  useEffect(() => {
    const fetchServerCategories = async () => {
      try {
        const { educationService } = await import("../services/educationService");
        const serverCats = await educationService.getCategories();
        if (serverCats.length > 0) {
          setCategoriesList((prev) => Array.from(new Set([...prev, ...serverCats])));
        }
      } catch {
        // Handle error silently
      }
    };
    fetchServerCategories();
  }, []);

  // YouTube modal states
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [youtubeUrlInput, setYoutubeUrlInput] = useState("");
  const [activeYoutubeBlock, setActiveYoutubeBlock] = useState<HTMLElement | null>(null);

  const handleCloseModal = () => {
    setIsYoutubeModalOpen(false);
    setYoutubeUrlInput("");
    setActiveYoutubeBlock(null);
  };

  const savedRangeRef = useRef<Range | null>(null);

  const openYoutubeModal = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
    setIsYoutubeModalOpen(true);
  };

  const [pendingDeleteBlock, setPendingDeleteBlock] = useState<HTMLElement | null>(null);
  const [isDeleteYoutubeConfirmOpen, setIsDeleteYoutubeConfirmOpen] = useState(false);

  const [activeImageBlock, setActiveImageBlock] = useState<HTMLElement | null>(null);
  const [pendingDeleteImageBlock, setPendingDeleteImageBlock] = useState<HTMLElement | null>(null);
  const [isDeleteImageConfirmOpen, setIsDeleteImageConfirmOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).editYoutubeBlock = (blockElement: HTMLElement) => {
      setActiveYoutubeBlock(blockElement);
      const anchor = blockElement.querySelector('a');
      const url = anchor ? anchor.getAttribute('href') : '';
      setYoutubeUrlInput(url || '');
      setIsYoutubeModalOpen(true);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).confirmDeleteYoutubeBlock = (blockElement: HTMLElement) => {
      setPendingDeleteBlock(blockElement);
      setIsDeleteYoutubeConfirmOpen(true);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).editImageBlock = (blockElement: HTMLElement) => {
      setActiveImageBlock(blockElement);
      editorImageInputRef.current?.click();
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).confirmDeleteImageBlock = (blockElement: HTMLElement) => {
      setPendingDeleteImageBlock(blockElement);
      setIsDeleteImageConfirmOpen(true);
    };
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).editYoutubeBlock;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).confirmDeleteYoutubeBlock;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).editImageBlock;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).confirmDeleteImageBlock;
    };
  }, []);

  interface YoutubeMetadata {
    title: string;
    authorName: string;
    thumbnailUrl: string;
    videoId: string;
  }

  const [modalYoutubeMeta, setModalYoutubeMeta] = useState<YoutubeMetadata | null>(null);
  const [isModalYoutubeLoading, setIsModalYoutubeLoading] = useState(false);
  const [modalYoutubeError, setModalYoutubeError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mainYoutubeMeta, setMainYoutubeMeta] = useState<YoutubeMetadata | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMainYoutubeLoading, setIsMainYoutubeLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mainYoutubeError, setMainYoutubeError] = useState<string | null>(null);

  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Modal YouTube oEmbed fetch
  useEffect(() => {
    const videoId = extractYoutubeId(youtubeUrlInput);
    if (!youtubeUrlInput.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalYoutubeMeta(null);
      setModalYoutubeError(null);
      return;
    }
    if (!videoId) {
      setModalYoutubeMeta(null);
      setModalYoutubeError("Format URL YouTube tidak valid.");
      return;
    }

    setModalYoutubeError(null);
    setIsModalYoutubeLoading(true);

    const fetchMeta = async () => {
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setModalYoutubeMeta({
          title: data.title || "",
          authorName: data.author_name || "",
          thumbnailUrl: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          videoId,
        });
      } catch {
        setModalYoutubeMeta({
          title: `Video YouTube (ID: ${videoId})`,
          authorName: "YouTube",
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          videoId,
        });
      } finally {
        setIsModalYoutubeLoading(false);
      }
    };

    const timer = setTimeout(fetchMeta, 400);
    return () => clearTimeout(timer);
  }, [youtubeUrlInput]);

  // Main Form YouTube oEmbed fetch
  useEffect(() => {
    const videoId = extractYoutubeId(fields.youtubeLink);
    if (!fields.youtubeLink.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMainYoutubeMeta(null);
      setMainYoutubeError(null);
      return;
    }
    if (!videoId) {
      setMainYoutubeMeta(null);
      setMainYoutubeError("Format URL YouTube tidak valid.");
      return;
    }

    setMainYoutubeError(null);
    setIsMainYoutubeLoading(true);

    const fetchMeta = async () => {
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMainYoutubeMeta({
          title: data.title || "",
          authorName: data.author_name || "",
          thumbnailUrl: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          videoId,
        });
      } catch {
        setMainYoutubeMeta({
          title: `Video YouTube (ID: ${videoId})`,
          authorName: "YouTube",
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          videoId,
        });
      } finally {
        setIsMainYoutubeLoading(false);
      }
    };

    const timer = setTimeout(fetchMeta, 400);
    return () => clearTimeout(timer);
  }, [fields.youtubeLink]);

  // Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll
  useEffect(() => {
    if (isYoutubeModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isYoutubeModalOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryDropdownOpen(false);
        setIsAddingNewCategory(false);
        setCategorySearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);

  // Sync initial content from DB (only once when loading finishes)
  useEffect(() => {
    if (!isLoading && editorRef.current) {
      editorRef.current.innerHTML = fields.content;
    }
  }, [isLoading, fields.content]);

  if (isLoading) {
    return <FormLoader />;
  }

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.");
      return;
    }

    const MAX_SIZE = 1024 * 1024; // 1 MB
    if (file.size > MAX_SIZE) {
      showToast({
        type: "error",
        title: "Ukuran Gambar Terlalu Besar",
        description: "Maksimal ukuran gambar sampul yang diperbolehkan adalah 1 MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        handleChange("thumbnail", e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };


  const insertHTML = (html: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      let range: Range | null = null;

      if (savedRangeRef.current) {
        range = savedRangeRef.current;
        selection?.removeAllRanges();
        selection?.addRange(range);
        savedRangeRef.current = null; // clear after restoring
      } else if (selection && selection.rangeCount > 0) {
        const currentRange = selection.getRangeAt(0);
        if (editorRef.current.contains(currentRange.commonAncestorContainer)) {
          range = currentRange;
        }
      }

      if (range) {
        range.deleteContents();
        
        const el = document.createElement("div");
        el.innerHTML = html;
        const fragment = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = fragment.appendChild(node);
        }
        range.insertNode(fragment);

        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
        
        handleChange("content", editorRef.current.innerHTML);
        return;
      }
      // Fallback
      // eslint-disable-next-line react-hooks/immutability
      editorRef.current.innerHTML += html;
      handleChange("content", editorRef.current.innerHTML);
    }
  };

  // Helper to use clinical template
  const applyClinicalTemplate = () => {
    const template = `<h3 class="text-lg font-bold text-[#1E293B] mt-4 mb-2">Cara Mengukur Gula Darah</h3><p class="text-sm text-[#4A5568] leading-relaxed mb-4">Cuci tangan sebelum menggunakan glukometer. Pastikan tangan benar-benar kering sebelum menyentuh strip tes untuk menghindari kontaminasi atau hasil yang tidak akurat.</p><h4 class="text-sm font-bold text-[#1E293B] mb-2">Langkah-langkah:</h4><ol class="list-decimal pl-5 text-sm text-[#4A5568] space-y-1 mb-4"><li>Siapkan alat (glukometer, strip, lancet)</li><li>Bersihkan jari dengan alkohol swab</li><li>Gunakan strip pada glukometer</li></ol><div class="bg-teal-50 border-l-4 border-[#00695C] p-4 my-4 rounded-r-lg text-sm text-[#00695C] font-semibold"><strong>Info Penting:</strong> Pemeriksaan sebaiknya dilakukan sebelum sarapan untuk hasil baseline yang paling akurat.</div>`;
    handleChange("content", template);
    handleChange("duration", 5);
    if (editorRef.current) {
      // eslint-disable-next-line react-hooks/immutability
      editorRef.current.innerHTML = template;
    }
  };

  // Helper to append formatting snippets
  const appendSnippet = (type: "judul" | "paragraf" | "langkah" | "info") => {
    let snippet = "";
    if (type === "judul") {
      snippet = '<h3 class="text-lg font-bold text-[#1E293B] mt-4 mb-2">Judul Bagian Baru</h3>';
    } else if (type === "paragraf") {
      snippet = '<p class="text-sm text-[#4A5568] leading-relaxed mb-4">Paragraf penjelasan materi baru di sini...</p>';
    } else if (type === "langkah") {
      snippet = '<ol class="list-decimal pl-5 text-sm text-[#4A5568] space-y-1 mb-4"><li>Langkah pertama</li><li>Langkah kedua</li></ol>';
    } else if (type === "info") {
      snippet = '<div class="bg-teal-50 border-l-4 border-[#00695C] p-4 my-4 rounded-r-lg text-sm text-[#00695C] font-semibold"><strong>Info Penting:</strong> Catatan informasi klinis penting di sini...</div>';
    }
    insertHTML(snippet);
  };

  const triggerEditorImageUpload = () => {
    editorImageInputRef.current?.click();
  };

  const handleEditorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setActiveImageBlock(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan.");
      setActiveImageBlock(null);
      return;
    }

    const MAX_SIZE = 1024 * 1024; // 1 MB
    if (file.size > MAX_SIZE) {
      showToast({
        type: "error",
        title: "Ukuran Gambar Terlalu Besar",
        description: "Maksimal ukuran gambar konten yang diperbolehkan adalah 1 MB.",
      });
      setActiveImageBlock(null);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        if (activeImageBlock) {
          const img = activeImageBlock.querySelector("img");
          if (img) {
            img.src = event.target.result;
          }
          if (editorRef.current) {
            handleChange("content", editorRef.current.innerHTML);
          }
        } else {
          const imgHtml = `<div class="my-6 w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all relative" contenteditable="false" draggable="true"><div class="block w-full relative bg-[#F1F5F9]"><img src="${event.target.result}" alt="Preview" class="w-full h-auto block object-contain" /><div class="absolute top-3 right-3 flex gap-2 z-20 editor-actions"><button type="button" onclick="window.editImageBlock(this.closest('[contenteditable=false]'))" class="bg-white text-gray-700 hover:bg-gray-50 rounded-lg p-2 shadow-md flex items-center justify-center cursor-pointer" style="border: none; outline: none;"><span class="material-symbols-outlined text-sm">edit</span></button><button type="button" onclick="window.confirmDeleteImageBlock(this.closest('[contenteditable=false]'))" class="bg-red-600 text-white hover:bg-red-700 rounded-lg p-2 shadow-md flex items-center justify-center cursor-pointer" style="border: none; outline: none;"><span class="material-symbols-outlined text-sm">delete</span></button></div></div><div class="editor-only-overlay absolute inset-0 bg-transparent cursor-pointer" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: transparent; z-index: 10;"></div></div>`;
          insertHTML(imgHtml + "<p><br></p>");
        }
      }
      setActiveImageBlock(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Insert YouTube video from modal
  const handleInsertYoutube = () => {
    const videoId = extractYoutubeId(youtubeUrlInput);
    if (videoId) {
      const title = modalYoutubeMeta?.title || `Video YouTube (ID: ${videoId})`;
      const authorName = modalYoutubeMeta?.authorName || "YouTube";
      const thumbnailUrl = modalYoutubeMeta?.thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      const embedHtml = `<div class="my-6 w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all relative" contenteditable="false" draggable="true" data-youtube-id="${videoId}"><div class="block aspect-video w-full relative bg-[#0F172A]"><img src="${thumbnailUrl}" alt="${title}" class="w-full h-full object-cover opacity-90" /><div class="absolute inset-0 flex items-center justify-center bg-black/10"><div class="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg"><span class="material-symbols-outlined text-[32px] text-white">play_arrow</span></div></div><div class="absolute top-3 right-3 flex gap-2 z-20 editor-actions"><button type="button" onclick="window.editYoutubeBlock(this.closest('[contenteditable=false]'))" class="bg-white text-gray-700 hover:bg-gray-50 rounded-lg p-2 shadow-md flex items-center justify-center cursor-pointer" style="border: none; outline: none;"><span class="material-symbols-outlined text-sm">edit</span></button><button type="button" onclick="window.confirmDeleteYoutubeBlock(this.closest('[contenteditable=false]'))" class="bg-red-600 text-white hover:bg-red-700 rounded-lg p-2 shadow-md flex items-center justify-center cursor-pointer" style="border: none; outline: none;"><span class="material-symbols-outlined text-sm">delete</span></button></div></div><div class="p-4 flex gap-3 items-start bg-white"><div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-red-600 text-lg">smart_display</span></div><div class="min-w-0 flex-1"><h4 class="text-sm font-bold text-[#1E293B] line-clamp-2 leading-snug">${title}</h4><p class="text-xs text-[#64748B] mt-1 font-semibold">${authorName}</p><a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="text-[11px] text-[#00695C] hover:underline mt-1 block font-semibold truncate">https://www.youtube.com/watch?v=${videoId}</a></div></div><div class="editor-only-overlay absolute inset-0 bg-transparent cursor-pointer" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: transparent; z-index: 10;"></div></div>`;

      if (activeYoutubeBlock) {
        // eslint-disable-next-line react-hooks/immutability
        activeYoutubeBlock.outerHTML = embedHtml;
        // Trigger editor input to update state
        if (editorRef.current) {
          handleChange("content", editorRef.current.innerHTML);
        }
      } else {
        // Create mode: insert at cursor
        insertHTML(embedHtml + "<p><br></p>");
      }

      handleChange("youtubeLink", youtubeUrlInput);
      setIsYoutubeModalOpen(false);
      setYoutubeUrlInput("");
      setActiveYoutubeBlock(null);
    }
  };

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    handleChange("content", e.currentTarget.innerHTML);
  };

  // Add custom new category dynamically in combobox
  const handleAddNewCategory = (): string => {
    const added = newCategoryInput.trim();
    if (added) {
      if (!categoriesList.includes(added)) {
        setCategoriesList((prev) => [...prev, added]);
      }
      handleChange("category", added);
      setNewCategoryInput("");
      setIsAddingNewCategory(false);
      setIsCategoryDropdownOpen(false);
      setCategorySearchQuery("");
      return added;
    }
    return fields.category;
  };

  // Centralized save handler that guarantees the latest DOM content and category are submitted
  const handleSave = (forcedStatus?: "Diterbitkan" | "Draf") => {
    let latestContent = fields.content;
    if (editorRef.current) {
      const clone = editorRef.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.editor-actions, .editor-only-overlay, button').forEach((el) => el.remove());
      latestContent = clone.innerHTML;
    }

    let latestCategory = fields.category;
    if (isAddingNewCategory && newCategoryInput.trim()) {
      latestCategory = handleAddNewCategory();
    }

    const override = {
      content: latestContent,
      category: latestCategory,
    };

    handleChange("content", latestContent);
    handleChange("category", latestCategory);

    save(forcedStatus, override);
  };

  const filteredCategories = categoriesList.filter((c) =>
    c.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const characterCount = fields.content.replace(/<[^>]*>/g, "").length;

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto w-full font-[family-name:var(--font-poppins)] relative">
      
      {/* YouTube insertion modal */}
      {isYoutubeModalOpen && typeof window !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#E2E8F0] space-y-4 font-[family-name:var(--font-poppins)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-[#E2E8F0]/80">
              <h4 className="font-bold text-base text-[#1E293B]">
                Sisipkan Video YouTube
              </h4>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-[#64748B] hover:text-[#1E293B] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                Tautan/Link Video YouTube
              </label>
              <input
                type="text"
                value={youtubeUrlInput}
                onChange={(e) => setYoutubeUrlInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none text-sm font-medium text-[#1E293B]"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-[10px] text-[#64748B] font-semibold mt-1">
                Mendukung format: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
              </p>
              
              {/* Validation errors */}
              {modalYoutubeError && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {modalYoutubeError}
                </p>
              )}

              {/* Loading indicator */}
              {isModalYoutubeLoading && (
                <div className="flex items-center gap-2 text-[#00695C] text-xs font-semibold py-2">
                  <LoadingSpinner size="sm" />
                  <span>Mengambil informasi video...</span>
                </div>
              )}

              {/* oEmbed Preview Card */}
              {modalYoutubeMeta && !isModalYoutubeLoading && (
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 flex gap-3 items-center">
                  <div className="w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-[#E2E8F0] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={modalYoutubeMeta.thumbnailUrl}
                      alt={modalYoutubeMeta.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="material-symbols-outlined text-white text-lg select-none">play_arrow</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-[#1E293B] line-clamp-1 leading-tight">
                      {modalYoutubeMeta.title}
                    </h5>
                    <p className="text-[10px] text-[#64748B] mt-1 font-semibold">
                      {modalYoutubeMeta.authorName}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                // eslint-disable-next-line react-hooks/immutability
                onClick={handleInsertYoutube}
                disabled={!modalYoutubeMeta || isModalYoutubeLoading}
                className="px-6 py-2.5 bg-[#00695C] text-white rounded-xl text-xs font-bold shadow-md shadow-[#00695C]/10 cursor-pointer hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sisipkan
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Back button above title */}
      <div className="mb-4">
        <BackButton href={ROUTES.MANAJEMEN_EDUKASI} label="Manajemen Edukasi" />
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <div>
          <h2 className="text-3xl font-bold text-[#1E293B] tracking-tight font-[family-name:var(--font-poppins)]">
            {articleId ? "Edit Materi Edukasi" : "Tambah Materi Edukasi"}
          </h2>
          <p className="text-[#64748B] text-sm mt-1 font-[family-name:var(--font-poppins)]">
            Lengkapi informasi materi edukasi pasien diabetes.
          </p>
        </div>
        <div className="flex w-full sm:w-auto justify-end gap-3 flex-wrap">
          <button
            onClick={() => handleSave("Draf")}
            disabled={isSaving}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full border border-[#E2E8F0] text-[#1E293B] text-sm font-semibold hover:bg-[#F1F5F9] transition-all cursor-pointer disabled:opacity-50 text-center"
          >
            Simpan Draft
          </button>
          <button
            onClick={() => handleSave("Diterbitkan")}
            disabled={isSaving}
            className="flex-1 sm:flex-initial px-8 py-2.5 rounded-full bg-[#00695C] text-white text-sm font-semibold shadow-lg shadow-[#00695C]/20 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 text-center"
          >
            Publikasikan
          </button>
        </div>
      </div>

      {/* Form Cards Stack */}
      <div className="space-y-8">
        
        {/* Card 1: Informasi Dasar */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-8 shadow-sm space-y-6">
          
          {/* Title input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-[family-name:var(--font-poppins)]">
              Judul Edukasi
            </label>
            <input
              type="text"
              value={fields.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={[
                "w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm placeholder:text-[#64748B]/50 font-medium font-[family-name:var(--font-poppins)]",
                errors.title ? "border-red-500" : "",
              ].join(" ")}
              placeholder="Masukkan judul materi edukasi..."
            />
            {errors.title && (
              <p className="text-red-500 text-xs font-semibold font-[family-name:var(--font-poppins)]">
                {errors.title}
              </p>
            )}
          </div>

          {/* Category, Author & Read time input row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Searchable Combobox Category */}
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                Kategori
              </label>
              
              {/* Dropdown trigger pill */}
              <div
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] outline-none flex justify-between items-center cursor-pointer bg-white text-sm font-semibold text-[#1E293B]"
              >
                <span>{fields.category || "Pilih Kategori"}</span>
                <span className="material-symbols-outlined text-[#64748B] select-none">expand_more</span>
              </div>

              {/* Combobox active panel list */}
              {isCategoryDropdownOpen && (
                <div className="absolute left-0 right-0 top-[76px] bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-40 max-h-[300px] overflow-hidden flex flex-col">
                  {/* Searchbox inside select dropdown */}
                  <div className="p-2 border-b border-[#E2E8F0] bg-[#F8F9FA] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#64748B] text-sm select-none">search</span>
                    <input
                      type="text"
                      placeholder="Cari kategori..."
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs w-full text-[#1E293B] font-medium"
                    />
                  </div>

                  {/* List items */}
                  <div className="overflow-y-auto flex-1 py-1">
                    {filteredCategories.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          handleChange("category", cat);
                          setIsCategoryDropdownOpen(false);
                          setCategorySearchQuery("");
                        }}
                        className={[
                          "px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between",
                          fields.category === cat
                            ? "bg-[#F0F9F8] text-[#00695C]"
                            : "text-[#1E293B] hover:bg-[#F1F5F9]",
                        ].join(" ")}
                      >
                        <span>{cat}</span>
                        {fields.category === cat && (
                          <span className="material-symbols-outlined text-[#00695C] text-sm select-none">check</span>
                        )}
                      </div>
                    ))}
                    {filteredCategories.length === 0 && !isAddingNewCategory && (
                      <p className="text-xs text-[#64748B] text-center py-3">Tidak ditemukan</p>
                    )}
                  </div>

                  {/* Add Kategori trigger options */}
                  <div className="border-t border-[#E2E8F0] p-2 bg-[#F8F9FA]">
                    {isAddingNewCategory ? (
                      <div className="flex gap-1.5 items-center w-full">
                        <input
                          type="text"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          placeholder="Kategori baru..."
                          className="flex-1 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs outline-none bg-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewCategory}
                          className="bg-[#00695C] text-white p-1.5 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90"
                        >
                          <span className="material-symbols-outlined text-xs select-none">check</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNewCategory(false);
                            setNewCategoryInput("");
                          }}
                          className="bg-gray-200 text-gray-500 p-1.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300"
                        >
                          <span className="material-symbols-outlined text-xs select-none">close</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewCategory(true)}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#00695C] hover:bg-[#F0F9F8] rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm select-none">add</span>
                        <span>Tambah Kategori Baru</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Author / Penulis Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                Penulis / Author
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fields.createdBy}
                  onChange={(e) => handleChange("createdBy", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none text-sm font-semibold font-[family-name:var(--font-poppins)] text-[#1E293B] placeholder:text-[#64748B]/50"
                  placeholder="Contoh: dr. Sarah, Sp.PD"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] opacity-40 select-none">
                  person
                </span>
              </div>
            </div>

            {/* Read time duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                Estimasi Membaca (Menit)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={fields.duration || ""}
                  onChange={(e) => handleChange("duration", parseInt(e.target.value) || 0)}
                  className={[
                    "w-full px-5 py-3.5 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none text-sm font-semibold font-[family-name:var(--font-poppins)] text-[#1E293B]",
                    errors.duration ? "border-red-500" : "",
                  ].join(" ")}
                  placeholder="Contoh: 5"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] opacity-40 select-none">
                  timer
                </span>
              </div>
              {errors.duration && (
                <p className="text-red-500 text-xs font-semibold font-[family-name:var(--font-poppins)]">
                  {errors.duration}
                </p>
              )}
            </div>

          </div>

          {/* Banner Upload Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-[family-name:var(--font-poppins)]">
              Banner Materi
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />

            {fields.thumbnail ? (
              <div className="relative group rounded-xl overflow-hidden border border-[#E2E8F0] aspect-video bg-[#F1F5F9] max-w-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fields.thumbnail}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={triggerUpload}
                    className="bg-white text-[#00695C] px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-[#F0F9F8]"
                  >
                    Ubah Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("thumbnail", "")}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-red-50"
                  >
                    Hapus Banner
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={triggerUpload}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-[#E2E8F0] hover:border-[#00695C] rounded-xl p-12 flex flex-col items-center justify-center bg-[#F1F5F9]/30 hover:bg-[#F1F5F9]/60 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <span className="material-symbols-outlined text-[#00695C] text-2xl select-none">add_a_photo</span>
                </div>
                <p className="text-sm text-[#1E293B] font-semibold font-[family-name:var(--font-poppins)]">
                  Klik atau seret file banner ke sini
                </p>
                <p className="text-[11px] text-[#64748B] mt-1 font-[family-name:var(--font-poppins)]">
                  Format PNG, JPG (Maks. 5MB, Rekomendasi 16:9)
                </p>
              </div>
            )}
            {errors.thumbnail && (
              <p className="text-red-500 text-xs font-semibold font-[family-name:var(--font-poppins)]">
                {errors.thumbnail}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-[family-name:var(--font-poppins)]">
              Ringkasan Singkat
            </label>
            <textarea
              value={fields.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value.slice(0, 250))}
              className={[
                "w-full px-5 py-4 rounded-xl border border-[#E2E8F0] focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] outline-none transition-all text-sm resize-none font-medium font-[family-name:var(--font-poppins)] text-[#1E293B] placeholder:text-[#64748B]/50",
                errors.shortDescription ? "border-red-500" : "",
              ].join(" ")}
              placeholder="Deskripsi singkat untuk kartu materi..."
              rows={3}
            />
            <div className="flex justify-between items-center text-[10px] font-semibold font-[family-name:var(--font-poppins)] text-[#64748B]">
              <span>
                {errors.shortDescription && (
                  <span className="text-red-500">{errors.shortDescription}</span>
                )}
              </span>
              <span>{fields.shortDescription.length} / 250 Karakter</span>
            </div>
          </div>
        </div>

        {/* Card 2: Editor (Isi Konten Edukasi) */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm">
          
          <div className="border-b border-[#E2E8F0] px-8 py-5 flex items-center justify-between bg-[#F1F5F9]/10">
            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-[family-name:var(--font-poppins)]">
              Isi Konten Edukasi
            </label>
            <button
              type="button"
              onClick={applyClinicalTemplate}
              className="flex items-center gap-2 text-xs font-bold text-[#00695C] hover:bg-[#00695C]/5 px-4 py-2 rounded-lg transition-all cursor-pointer font-[family-name:var(--font-poppins)]"
            >
              <span className="material-symbols-outlined text-sm select-none">magic_button</span>
              <span>Gunakan Template Klinis</span>
            </button>
          </div>

          <div className="p-4 sm:p-8 space-y-6">
            
            {/* Editor Toolbar with Youtube integration */}
            <div className="flex flex-wrap gap-2 p-2 bg-[#F1F5F9]/50 rounded-xl">
              <input
                type="file"
                ref={editorImageInputRef}
                onChange={handleEditorImageChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => appendSnippet("judul")}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-[11px] font-bold text-[#64748B] hover:text-[#00695C] hover:border-[#00695C] transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm select-none">title</span>
                <span>Judul</span>
              </button>
              <button
                type="button"
                onClick={() => appendSnippet("paragraf")}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-[11px] font-bold text-[#64748B] hover:text-[#00695C] hover:border-[#00695C] transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm select-none">format_align_left</span>
                <span>Paragraf</span>
              </button>
              <button
                type="button"
                onClick={() => appendSnippet("langkah")}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-[11px] font-bold text-[#64748B] hover:text-[#00695C] hover:border-[#00695C] transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm select-none">format_list_bulleted</span>
                <span>Langkah</span>
              </button>
              <button
                type="button"
                onClick={() => appendSnippet("info")}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-[11px] font-bold text-[#64748B] hover:text-[#00695C] hover:border-[#00695C] transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm select-none">warning</span>
                <span>Info Penting</span>
              </button>
              <button
                type="button"
                onClick={triggerEditorImageUpload}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-[11px] font-bold text-[#64748B] hover:text-[#00695C] hover:border-[#00695C] transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm select-none">image</span>
                <span>Gambar</span>
              </button>
              {/* Rich text Toolbar extension: youtube */}
              <button
                type="button"
                onClick={openYoutubeModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg border border-[#E2E8F0] text-[11px] font-bold text-[#64748B] hover:text-[#00695C] hover:border-[#00695C] transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm select-none">smart_display</span>
                <span>YouTube</span>
              </button>
            </div>

            {/* Editor Canvas Area */}
            <div className="space-y-2">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                data-placeholder="Tulis atau gunakan template klinis untuk menyusun materi edukasi..."
                className={[
                  "w-full min-h-[500px] border border-[#E2E8F0] rounded-xl p-4 sm:p-8 outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C] transition-all text-sm leading-relaxed font-medium font-[family-name:var(--font-poppins)] text-[#1E293B] editor-container overflow-y-auto whitespace-pre-wrap",
                  errors.content ? "border-red-500" : "",
                ].join(" ")}
              />
              {errors.content && (
                <p className="text-red-500 text-xs font-semibold font-[family-name:var(--font-poppins)]">
                  {errors.content}
                </p>
              )}
            </div>

            {/* Footer Meta */}
            <div className="mt-4 flex items-center justify-between px-2 text-[11px] text-[#64748B] font-medium font-[family-name:var(--font-poppins)] border-t border-[#E2E8F0]/50 pt-4">
              <div className="flex gap-6">
                <span>
                  Karakter: <b className="text-[#1E293B]">{characterCount}</b>
                </span>
                <span>
                  Estimasi baca: <b className="text-[#1E293B]">{fields.duration || 0} Menit</b>
                </span>
              </div>
              <span className="uppercase tracking-widest text-[#00695C] font-bold">
                Status: {fields.status}
              </span>
            </div>

          </div>

        </div>

        {/* Card 3: Publication Settings */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#1E293B] font-[family-name:var(--font-poppins)]">
              Status Publikasi
            </h4>
            <p className="text-xs text-[#64748B] mt-1 font-[family-name:var(--font-poppins)]">
              Atur visibilitas konten untuk aplikasi pasien.
            </p>
          </div>

          <div className="flex bg-[#F1F5F9] p-1.5 rounded-full border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => handleChange("status", "Draf")}
              className={[
                "px-8 py-2 rounded-full text-xs font-bold transition-all cursor-pointer",
                fields.status === "Draf"
                  ? "bg-white shadow-sm text-[#00695C]"
                  : "text-[#64748B] hover:text-[#1E293B]",
              ].join(" ")}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => handleChange("status", "Diterbitkan")}
              className={[
                "px-8 py-2 rounded-full text-xs font-bold transition-all cursor-pointer",
                fields.status === "Diterbitkan"
                  ? "bg-white shadow-sm text-[#00695C]"
                  : "text-[#64748B] hover:text-[#1E293B]",
              ].join(" ")}
            >
              Publikasikan
            </button>
          </div>
        </div>

        {/* Global Actions Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 py-8 border-t border-[#E2E8F0]/40">
          <button
            onClick={handleCancelClick}
            className="w-full sm:w-auto px-8 py-3 rounded-xl border border-[#E2E8F0] text-[#1E293B] text-sm font-bold hover:bg-[#F4F6F8] transition-all shadow-sm cursor-pointer text-center"
          >
            Batal
          </button>
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#00695C] text-white text-sm font-bold shadow-xl shadow-[#00695C]/25 hover:opacity-90 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 text-center"
          >
            <span className="material-symbols-outlined text-lg select-none">send</span>
            <span>{articleId ? "Simpan Perubahan" : "Publikasikan Sekarang"}</span>
          </button>
        </div>

      </div>

      <ConfirmationModal
        open={isCancelOpen}
        title="Batalkan Perubahan?"
        description="Perubahan yang belum disimpan akan hilang."
        variant="warning"
        confirmText="Ya, Batalkan"
        cancelText="Lanjut Mengedit"
        onConfirm={() => {
          setIsCancelOpen(false);
          setIsDirty(false); // bypass beforeunload
          cancel();
        }}
        onCancel={() => setIsCancelOpen(false)}
      />

      <ConfirmationModal
        open={isDeleteYoutubeConfirmOpen}
        title="Hapus Video YouTube?"
        description="Apakah Anda yakin ingin menghapus video YouTube ini dari materi edukasi?"
        variant="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={() => {
          if (pendingDeleteBlock) {
            pendingDeleteBlock.remove();
            if (editorRef.current) {
              handleChange("content", editorRef.current.innerHTML);
            }
          }
          setIsDeleteYoutubeConfirmOpen(false);
          setPendingDeleteBlock(null);
          showToast({
            type: "success",
            title: "Berhasil",
            description: "Video YouTube berhasil dihapus dari konten.",
          });
        }}
        onCancel={() => {
          setIsDeleteYoutubeConfirmOpen(false);
          setPendingDeleteBlock(null);
        }}
      />

      <ConfirmationModal
        open={isDeleteImageConfirmOpen}
        title="Hapus Gambar?"
        description="Apakah Anda yakin ingin menghapus gambar ini dari materi edukasi?"
        variant="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onConfirm={() => {
          if (pendingDeleteImageBlock) {
            pendingDeleteImageBlock.remove();
            if (editorRef.current) {
              handleChange("content", editorRef.current.innerHTML);
            }
          }
          setIsDeleteImageConfirmOpen(false);
          setPendingDeleteImageBlock(null);
          showToast({
            type: "success",
            title: "Berhasil",
            description: "Gambar berhasil dihapus dari konten.",
          });
        }}
        onCancel={() => {
          setIsDeleteImageConfirmOpen(false);
          setPendingDeleteImageBlock(null);
        }}
      />
    </div>
  );
}

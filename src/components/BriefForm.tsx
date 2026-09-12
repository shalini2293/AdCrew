import React, { useState } from "react";
import { BrandProfile, ProductBrief, ReferenceAd } from "../types";
import { PRESET_PRODUCTS } from "../data/presets";
import {
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Flame,
  Coffee,
  Moon,
  Info,
} from "lucide-react";

interface BriefFormProps {
  product: ProductBrief;
  setProduct: React.Dispatch<React.SetStateAction<ProductBrief>>;
  brand: BrandProfile;
  setBrand: React.Dispatch<React.SetStateAction<BrandProfile>>;
  onGenerateConcepts: () => void;
  isLoading: boolean;
}

export const BriefForm: React.FC<BriefFormProps> = ({
  product,
  setProduct,
  brand,
  setBrand,
  onGenerateConcepts,
  isLoading,
}) => {
  const [activePresetId, setActivePresetId] = useState<string>("aurarest");
  const [newBenefit, setNewBenefit] = useState<string>("");

  const handleApplyPreset = (presetId: string) => {
    const found = PRESET_PRODUCTS.find((p) => p.id === presetId);
    if (found) {
      setActivePresetId(presetId);
      setProduct({ ...found.product });
      setBrand({ ...found.brand });
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setProduct((prev) => ({
        ...prev,
        coreBenefits: [...prev.coreBenefits, newBenefit.trim()],
      }));
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      coreBenefits: prev.coreBenefits.filter((_, i) => i !== index),
    }));
  };

  // Image Upload handler for product
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setProduct((prev) => ({ ...prev, productImage: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Reference Image uploader
  const handleAddReferenceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        const newRef: ReferenceAd = {
          id: `ref-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ""),
          url: base64,
          description: "Uploaded reference ad with approved visual tone.",
        };
        setBrand((prev) => ({
          ...prev,
          referenceImages: [...prev.referenceImages, newRef],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReferenceImage = (id: string) => {
    setBrand((prev) => ({
      ...prev,
      referenceImages: prev.referenceImages.filter((r) => r.id !== id),
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Intro Header */}
      <div className="text-center space-y-2 pt-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Step 1 &bull; Product Brief & Brand Profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-100 tracking-tight font-display">
          Configure Your Ad Campaign Context
        </h1>
        <p className="text-sm text-stone-400 max-w-2xl mx-auto">
          AdCrew’s specialized agents use your brief, audience constraints, and reference ads to draft high-converting concepts before generating production assets.
        </p>
      </div>

      {/* Preset Explorer Selector */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Load Quick Example Brief:</span>
          </div>
          <span className="text-[11px] text-stone-500">1-click sample setup</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESET_PRODUCTS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            let Icon = Sparkles;
            if (preset.id === "aurarest") Icon = Flame;
            if (preset.id === "veloce-nitro") Icon = Coffee;
            if (preset.id === "nocturne") Icon = Moon;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.id)}
                className={`flex items-start p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/50 text-stone-100 shadow-sm"
                    : "bg-stone-950/40 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                }`}
              >
                <Icon
                  className={`w-4 h-4 mt-0.5 mr-2.5 flex-shrink-0 ${
                    isSelected ? "text-amber-400" : "text-stone-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 ml-1 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                    {preset.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left = Product Brief, Right = Brand Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PRODUCT BRIEF CARD */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-4 shadow-lg">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>1. Product Brief</span>
            </h2>
            <span className="text-xs text-stone-500 font-mono">Core offering</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={product.productName}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, productName: e.target.value }))
              }
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="e.g. AuraRest ErgoPro Cushion"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Category
            </label>
            <input
              type="text"
              value={product.category}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="e.g. Ergonomics & Desk Wellness"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Product Description *
            </label>
            <textarea
              rows={3}
              value={product.description}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
              placeholder="Describe what the product physically is and what it does..."
            />
          </div>

          {/* Core Benefits */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Core Benefits & Value Props ({product.coreBenefits.length})
            </label>
            <div className="space-y-2 mb-2">
              {product.coreBenefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-stone-950/70 border border-stone-800/80 rounded-lg px-3 py-1.5 text-stone-200"
                >
                  <span className="flex-1 pr-2 truncate">• {benefit}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(idx)}
                    className="text-stone-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddBenefit())}
                placeholder="Add a benefit (e.g. Relieves lumbar pressure in 15 mins)..."
                className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Product Photo Upload */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              Product Photo / Visual Reference (Optional)
            </label>
            <div className="flex items-center space-x-3">
              {product.productImage ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-700 flex-shrink-0 bg-stone-950">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setProduct((prev) => ({ ...prev, productImage: undefined }))}
                    className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-stone-300 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg border border-dashed border-stone-800 flex items-center justify-center text-stone-600 bg-stone-950">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}

              <label className="flex-1 cursor-pointer bg-stone-950/60 border border-stone-800 hover:border-stone-700 rounded-lg p-2.5 text-center text-xs text-stone-400 hover:text-stone-200 transition-colors">
                <Upload className="w-4 h-4 mx-auto mb-1 text-stone-400" />
                <span>Upload product photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* BRAND PROFILE CARD */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-4 shadow-lg">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>2. Brand Profile & Audience</span>
            </h2>
            <span className="text-xs text-stone-500 font-mono">Creative guardrails</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Brand Name *
            </label>
            <input
              type="text"
              value={brand.brandName}
              onChange={(e) =>
                setBrand((prev) => ({ ...prev, brandName: e.target.value }))
              }
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="e.g. AuraRest Ergonomics"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Brand Tone / Voice *
            </label>
            <input
              type="text"
              value={brand.brandTone}
              onChange={(e) =>
                setBrand((prev) => ({ ...prev, brandTone: e.target.value }))
              }
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="e.g. Empathetic, Clinical & Clean Minimalist"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Target Audience *
            </label>
            <textarea
              rows={2}
              value={brand.targetAudience}
              onChange={(e) =>
                setBrand((prev) => ({ ...prev, targetAudience: e.target.value }))
              }
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
              placeholder="Who are we speaking to? What is their lifestyle or pain point?"
            />
          </div>

          {/* Reference Images */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-stone-300 flex items-center space-x-1.5">
                <span>Reference Ads ("Good" for brand)</span>
                <span className="text-stone-500">({brand.referenceImages.length})</span>
              </label>
              <label className="cursor-pointer text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1">
                <Plus className="w-3 h-3" />
                <span>Add Custom Ref</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddReferenceImage}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {brand.referenceImages.map((ref) => (
                <div
                  key={ref.id}
                  className="group relative bg-stone-950 border border-stone-800 rounded-lg overflow-hidden p-2 text-left"
                >
                  <div className="h-20 w-full rounded bg-stone-900 mb-2 overflow-hidden relative">
                    {ref.url ? (
                      <img
                        src={ref.url}
                        alt={ref.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-700">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveReferenceImage(ref.id)}
                      className="absolute top-1 right-1 bg-black/70 rounded p-1 text-stone-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] font-semibold text-stone-200 truncate">
                    {ref.title}
                  </p>
                  <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5 leading-tight">
                    {ref.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Critic Rubric Transparency Notice */}
      <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-4 flex items-start space-x-3 text-xs text-stone-400">
        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-stone-200">
            AdCrew Critic Evaluation Guarantee:
          </span>
          <p>
            Once you confirm a concept, our <strong>Critic Agent</strong> will strictly score the output across four independent dimensions: <em>Aesthetic Quality</em>, <em>Brand Fit</em>, <em>Product Faithfulness</em> (never offset by visuals), and <em>Audience Sentiment</em>. Assets must pass all dimensions (&ge; 7.0) before shipping, with up to 3 automated revision cycles.
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 flex justify-center">
        <button
          type="button"
          onClick={onGenerateConcepts}
          disabled={isLoading || !product.productName || !brand.brandTone}
          className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-base shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              <span>Ideation Agent Drafting Concepts...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-current" />
              <span>Draft 3–5 Ad Concepts with Ideation Agent</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

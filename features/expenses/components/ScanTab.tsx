"use client";

import type { DragEvent, RefObject } from "react";
import Image from "next/image";
import { CATEGORIES } from "@/features/expenses/constants";
import type { ReceiptData, ReceiptItem } from "@/features/expenses/types";

interface ScanTabProps {
  uploadedImage: string | null;
  receiptData: ReceiptData | null;
  editedItems: ReceiptItem[];
  storeName: string;
  purchaseDate: string;
  isAnalyzing: boolean;
  isSaving: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDrop: (e: DragEvent) => void;
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  onReset: () => void;
  onSave: () => void;
  onStoreNameChange: (value: string) => void;
  onPurchaseDateChange: (value: string) => void;
  onItemUpdate: (index: number, field: keyof ReceiptItem, value: string | number) => void;
  onItemDelete: (index: number) => void;
  currentTotal: number;
}

export default function ScanTab({
  uploadedImage,
  receiptData,
  editedItems,
  storeName,
  purchaseDate,
  isAnalyzing,
  isSaving,
  fileInputRef,
  onDrop,
  onFileSelect,
  onAnalyze,
  onReset,
  onSave,
  onStoreNameChange,
  onPurchaseDateChange,
  onItemUpdate,
  onItemDelete,
  currentTotal,
}: ScanTabProps) {
  if (!uploadedImage) {
    return (
      <div className="card">
        <h3>рџ“· Р—Р°РіСЂСѓР·РёС‚Рµ С„РѕС‚Рѕ С‡РµРєР°</h3>
        <div
          className="upload-area"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">рџ“¤</div>
          <p>РџРµСЂРµС‚Р°С‰РёС‚Рµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ РёР»Рё РЅР°Р¶РјРёС‚Рµ РґР»СЏ РІС‹Р±РѕСЂР°</p>
          <span>РџРѕРґРґРµСЂР¶РёРІР°СЋС‚СЃСЏ: JPG, PNG</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="visually-hidden"
            onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="preview-container">
      <div className="card">
        <h3>рџ–јпёЏ Р—Р°РіСЂСѓР¶РµРЅРЅС‹Р№ С‡РµРє</h3>
        <div className="preview-image">
          <Image
            src={uploadedImage}
            alt="Р§РµРє"
            width={1200}
            height={1800}
            unoptimized
            className="scan-image"
          />
        </div>
        <button className="btn btn-secondary btn-full mt-16" onClick={onReset}>
          рџ—‘пёЏ РЈРґР°Р»РёС‚СЊ
        </button>
      </div>

      <div>
        {!receiptData && (
          <div className="card">
            <h3>рџ”Ќ РђРЅР°Р»РёР· С‡РµРєР°</h3>
            <button className="btn btn-primary btn-full" onClick={onAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <div className="spinner"></div>
                  РђРЅР°Р»РёР·РёСЂСѓРµРј...
                </>
              ) : (
                <>рџ”Ќ Р Р°СЃРїРѕР·РЅР°С‚СЊ С‡РµРє</>
              )}
            </button>
          </div>
        )}

        {receiptData && editedItems.length > 0 && (
          <div className="card">
            <h3>вњЏпёЏ РџСЂРѕРІРµСЂСЊС‚Рµ РґР°РЅРЅС‹Рµ</h3>

            <div className="scan-form-grid">
              <div>
                <label className="scan-field-label">
                  рџЏЄ РњР°РіР°Р·РёРЅ
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => onStoreNameChange(e.target.value)}
                  className="scan-field-input"
                />
              </div>
              <div>
                <label className="scan-field-label">
                  рџ“… Р”Р°С‚Р°
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => onPurchaseDateChange(e.target.value)}
                  className="scan-field-input"
                />
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>РќР°Р·РІР°РЅРёРµ</th>
                    <th className="scan-col-price">Р¦РµРЅР° (в‚¬)</th>
                    <th className="scan-col-category">РљР°С‚РµРіРѕСЂРёСЏ</th>
                    <th className="scan-col-delete"></th>
                  </tr>
                </thead>
                <tbody>
                  {editedItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => onItemUpdate(index, "name", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => onItemUpdate(index, "price", parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td>
                        <select value={item.category} onChange={(e) => onItemUpdate(index, "category", e.target.value)}>
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className="delete-btn" onClick={() => onItemDelete(index)}>
                          рџ—‘пёЏ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="total-row">
              <span className="total-label">рџ’° РС‚РѕРіРѕ:</span>
              <span className="total-value">{currentTotal.toFixed(2)} в‚¬</span>
            </div>

            <button className="btn btn-primary btn-full mt-16" onClick={onSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="spinner"></div>
                  РЎРѕС…СЂР°РЅСЏРµРј...
                </>
              ) : (
                <>рџ’ѕ РЎРѕС…СЂР°РЅРёС‚СЊ РІ Р±Р°Р·Сѓ РґР°РЅРЅС‹С…</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

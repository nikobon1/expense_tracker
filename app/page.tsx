'use client';

import { useEffect, useState } from 'react';
import DashboardTab from '@/features/expenses/components/DashboardTab';
import ScanTab from '@/features/expenses/components/ScanTab';
import { useDashboardData } from '@/features/expenses/hooks/useDashboardData';
import { useReceiptFlow } from '@/features/expenses/hooks/useReceiptFlow';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'scan' | 'dashboard'>('scan');
  const receiptFlow = useReceiptFlow();
  const dashboardData = useDashboardData();
  const {
    startDate,
    endDate,
    expenses,
    prevMonthTotal,
    setStartDate,
    setEndDate,
    loadExpenses,
  } = dashboardData;

  useEffect(() => {
    if (activeTab === 'dashboard') {
      void loadExpenses();
    }
  }, [activeTab, startDate, endDate, loadExpenses]);

  return (
    <div className="app-container">
      <main className="main-full">
        {receiptFlow.alert && (
          <div className={`alert ${receiptFlow.alert.type}`}>
            {receiptFlow.alert.type === 'success' ? 'вњ…' : 'вќЊ'} {receiptFlow.alert.message}
          </div>
        )}

        <header className="header">
          <h1>рџ§ѕ РўСЂРµРєРµСЂ Р Р°СЃС…РѕРґРѕРІ</h1>
          <p>РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРѕРµ СЂР°СЃРїРѕР·РЅР°РІР°РЅРёРµ С‡РµРєРѕРІ СЃ РїРѕРјРѕС‰СЊСЋ РР</p>
        </header>

        <div className="tabs">
          <button className={`tab ${activeTab === 'scan' ? 'active' : ''}`} onClick={() => setActiveTab('scan')}>
            рџ“· РЎРєР°РЅРёСЂРѕРІР°РЅРёРµ
          </button>
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            рџ“Љ Р”Р°С€Р±РѕСЂРґ
          </button>
        </div>

        {activeTab === 'scan' ? (
          <ScanTab
            uploadedImage={receiptFlow.uploadedImage}
            receiptData={receiptFlow.receiptData}
            editedItems={receiptFlow.editedItems}
            storeName={receiptFlow.storeName}
            purchaseDate={receiptFlow.purchaseDate}
            isAnalyzing={receiptFlow.isAnalyzing}
            isSaving={receiptFlow.isSaving}
            fileInputRef={receiptFlow.fileInputRef}
            onDrop={receiptFlow.handleDrop}
            onFileSelect={receiptFlow.handleFile}
            onAnalyze={receiptFlow.handleAnalyzeReceipt}
            onReset={receiptFlow.resetScanner}
            onSave={receiptFlow.handleSaveReceipt}
            onStoreNameChange={receiptFlow.setStoreName}
            onPurchaseDateChange={receiptFlow.setPurchaseDate}
            onItemUpdate={receiptFlow.updateItem}
            onItemDelete={receiptFlow.deleteItem}
            currentTotal={receiptFlow.currentTotal}
          />
        ) : (
          <DashboardTab
            startDate={startDate}
            endDate={endDate}
            expenses={expenses}
            prevMonthTotal={prevMonthTotal}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        )}
      </main>
    </div>
  );
}

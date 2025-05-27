export function useMessageLabel() {
  const labelRules = [
    { keywords: ['有空', '方便', '時間', '空檔'], label: '詢問空檔' },
    { keywords: ['還有', '在嗎', '租出去', '剩下'], label: '詢問房源' },
    { keywords: ['降價', '便宜', '再低', '可議'], label: '詢問價格' },
    { keywords: ['看房', '安排', '參觀', '現場'], label: '預約看房' },
    { keywords: ['地址', '地點', '位置'], label: '詢問位置' },
    { keywords: ['更多照片'], label: '詢問照片' },
    { keywords: ['設備', '傢俱', '洗衣機', '冰箱'], label: '詢問設備' },
    { keywords: ['停車', '車位'], label: '詢問車位' },
    { keywords: ['租約', '期限', '幾個月', '短租'], label: '詢問租期' },
    { keywords: ['包水電', '含水電', '電費'], label: '詢問費用' },
    { keywords: ['寵物', '養寵物', '貓', '狗'], label: '詢問寵物' },
    { keywords: ['網路', 'wifi', '電視'], label: '詢問網路' },
  ];

  function getLabelFromMessage(message: string): string {
    const text = message?.toLowerCase() || '';
    for (const rule of labelRules) {
      if (rule.keywords.some(keyword => text.includes(keyword))) {
        return rule.label;
      }
    }
    return '';
  }

  return { getLabelFromMessage };
}
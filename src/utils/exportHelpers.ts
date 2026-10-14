import { toPng, toBlob } from 'html-to-image';

export const copyDashboardImageToClipboard = async (
  elementId: string
): Promise<{ success: boolean; message: string }> => {
  const node = document.getElementById(elementId);
  if (!node) {
    return { success: false, message: 'Dashboard canvas element not found.' };
  }

  try {
    const blob = await toBlob(node, {
      pixelRatio: 2,
      cacheBust: true,
      filter: (domNode) => {
        // filter out unwanted UI overlays or tooltips during capture
        if (domNode instanceof HTMLElement) {
          if (domNode.classList.contains('no-export')) return false;
        }
        return true;
      },
    });

    if (!blob) {
      return { success: false, message: 'Failed to create image blob.' };
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);

    return { success: true, message: 'High-res dashboard image copied to clipboard!' };
  } catch (err: any) {
    console.error('Clipboard copy error:', err);
    return {
      success: false,
      message: `Failed to copy image to clipboard: ${err.message || 'Browser permission denied'}`,
    };
  }
};

export const downloadDashboardImage = async (
  elementId: string,
  filename = 'dashboard-layout.png'
): Promise<boolean> => {
  const node = document.getElementById(elementId);
  if (!node) return false;

  try {
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      cacheBust: true,
      filter: (domNode) => {
        if (domNode instanceof HTMLElement) {
          if (domNode.classList.contains('no-export')) return false;
        }
        return true;
      },
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (err) {
    console.error('Download image error:', err);
    return false;
  }
};

export const downloadJsonFile = (data: any, filename = 'dashboard-spec.json') => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy text failed:', err);
    return false;
  }
};

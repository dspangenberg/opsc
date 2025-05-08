/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useCallback } from 'react';

interface FileDownloadProps {
  route: string;
  filename?: string;
}

export const useFileDownload = ({ route, filename }: FileDownloadProps) => {
  const handleDownload = useCallback(() => {
    console.log(route)
    fetch(route as unknown as string)
      .then(res => res.blob())
      .then(blob => {
        const file = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = file;
        link.download = filename || 'unknown.pdf';

        link.click();
        window.URL.revokeObjectURL(file);
      })
      .catch(error => {
        console.error('Error downloading invoice:', error);
        // You might want to add some error handling here, like showing a notification to the user
      });
  }, [filename]);

  return { handleDownload };
};

import { useCallback, useRef } from 'react'

import { fetchSampleDataset } from '../lib/api'

interface UseFileUploadOptions {
    onFileSelected: (file: File) => void
    accept?: string
}

/**
 * Hook for handling file uploads with support for sample data fallback.
 */
export function useFileUpload({ onFileSelected, accept = '.csv' }: UseFileUploadOptions) {
    const inputRef = useRef<HTMLInputElement>(null)

    const openFilePicker = useCallback(() => {
        inputRef.current?.click()
    }, [])

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                onFileSelected(file)
            }
        },
        [onFileSelected],
    )

    const clearInput = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }, [])

    const loadSampleData = useCallback(async () => {
        const sampleFile = await fetchSampleDataset()
        onFileSelected(sampleFile)
    }, [onFileSelected])

    return {
        inputRef,
        inputProps: {
            ref: inputRef,
            type: 'file' as const,
            accept,
            onChange: handleChange,
            className: 'hidden',
        },
        openFilePicker,
        clearInput,
        loadSampleData,
    }
}


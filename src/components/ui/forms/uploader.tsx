import { useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { UploadIcon } from '@/components/icons/upload-icon';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { useUploads } from '@/framework/settings';

export default function Uploader({
  onChange,
  value,
  name,
  onBlur,
  multiple = false,
}: any) {

  const {
    mutate: upload,
    isLoading,
    files,
  } = useUploads({
    onChange,
    defaultFiles: value,
  });

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      upload(acceptedFiles);
    },
    [upload]
  );
  const { getRootProps, getInputProps } = useDropzone({
    //@ts-ignore
    accept: 'image/*',
    multiple,
    onDrop,
  });
  //FIXME: package update need to check
  // types: [
  //   {
  //     description: 'Images',
  //     accept: {
  //       'image/*': ['.png', '.gif', '.jpeg', '.jpg']
  //     }
  //   },
  // ],
  // excludeAcceptAllOption: true,
  // multiple: false
  const thumbs = files.map((file: any, idx) => (
    <div
      className="relative inline-flex flex-col mt-2 overflow-hidden border rounded border-border-100 mr-2 rtl:ml-2"
      key={idx}
    >
      <div className="flex items-center justify-center w-16 h-16 min-w-0 overflow-hidden">
        {/* eslint-disable */}
        <img src={file.preview} alt={file?.name} />
      </div>
    </div>
  ));
  //FIXME: maybe no need to use this
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="upload">
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 border-border-base h-36 rounded flex flex-col justify-center items-center cursor-pointer focus:border-accent-400 focus:outline-none',
        })}
      >
        <input
          {...getInputProps({
            name,
            onBlur,
          })}
        />
        <UploadIcon className="text-muted-light" />
        <p className="mt-4 text-sm text-center text-body">
          <span className="font-semibold text-accent">
            Upload an image
          </span>{' '}
          or drag and drop <br />
          <span className="text-xs text-body">PNG, JPG</span>
        </p>
      </div>

      <aside className="flex flex-wrap mt-2">
        {!!thumbs.length && thumbs}
        {isLoading && (
          <div className="flex items-center h-16 mt-2 ml-2 rtl:mr-2">
            <Spinner
              text='Loading'
              simple={true}
              className="w-6 h-6"
            />
          </div>
        )}
      </aside>
    </section>
  );
}

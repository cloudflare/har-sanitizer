/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FileInput } from "../_ui/FileInput";

export type HARUpload = {
	raw: string;
	parsed: any;
	name: string;
};

type UploadHarProps = {
	setUpload: (value: HARUpload) => void;
};

export const UploadHar: React.FC<UploadHarProps> = ({ setUpload }) => {
	const [harError, setHarError] = useState<string>("");

	const handleFileChange = (selectedFile: File) => {
		if (selectedFile) {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const fileContents = e?.target?.result;
					if (
						fileContents &&
						(typeof fileContents === "string" || fileContents instanceof String)
					) {
						setUpload({
							raw: fileContents as string,
							name: selectedFile.name,
							parsed: JSON.parse(fileContents as string),
						});
						setHarError("");
						return;
					}
					throw new Error("failed to upload file");
				} catch (e) {
					console.log(e);
					setHarError(`invalid har file: ${e?.toString()}`);
				}
			};

			reader.readAsText(selectedFile);
		}
	};

	return (
		<div className="space-y-2">
			<label className="block" htmlFor="har-file">
				HAR File
			</label>
			<FileInput
				className="block"
				id="har-file"
				onFileChange={handleFileChange}
				accept=".har"
			/>
			{harError && <p className="text-red-700 dark:text-red-500">{harError}</p>}
		</div>
	);
};

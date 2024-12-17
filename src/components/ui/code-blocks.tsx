"use client";

import { CopyButton } from "./copy-button";
import { Skeleton } from "./skeleton";
import oneDarkPro from "shiki/themes/min-light.mjs";
import {
	getHighlighterCore,
	type StringLiteralUnion,
	type HighlighterCore,
} from "shiki/core";
import ts from "shiki/langs/typescript.mjs";
import js from "shiki/langs/javascript.mjs";
import bash from "shiki/langs/bash.mjs";
import docker from "shiki/langs/dockerfile.mjs";
import json from "shiki/langs/json.mjs";
import getWasm from "shiki/wasm.mjs";
import { useEffect, useMemo } from "react";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import Editor from "react-simple-code-editor";

async function getHighlighter() {
	const highlighter = await getHighlighterCore({
		themes: [oneDarkPro],
		langs: [ts, js, bash, docker, json],
		loadWasm: getWasm,
	});
	return highlighter;
}

let highlighter: HighlighterCore | undefined = undefined;

export function highlightCode(code: string, lang: StringLiteralUnion<string>) {
	if (!highlighter) {
		getHighlighter().then((e) => {
			highlighter = e;
		});
	}
	return highlighter?.codeToHtml(code, {
		lang,
		theme: "min-light",
	});
}

// export function EditCodeBlock(props: {
// 	code: string;
// 	onChange: (code: string) => void;
// 	lang: StringLiteralUnion<string>;
// }) {
// 	const [_highlighter, setHighlighter] = React.useState<
// 		HighlighterCore | undefined
// 	>(highlighter);

// 	useEffect(() => {
// 		if (!highlighter) getHighlighter().then(setHighlighter);
// 	}, []);

// 	return (
// 		<Editor
// 			className="rounded-xl [&>pre]:!p-0 [&>pre>br]:hidden"
// 			value={props.code}
// 			onValueChange={(code) => props.onChange(code)}
// 			highlight={(code) => {
// 				return _highlighter?.codeToHtml(code, {
// 					lang: props.lang,
// 					theme: "min-light",
// 				});
// 			}}
// 			textareaClassName="caret-white"
// 			padding={8}
// 			style={{
// 				fontFamily: '"Fira code", "Fira Mono", monospace',
// 				fontSize: 12,
// 			}}
// 		/>
// 	);
// }

export function CodeBlock(props: {
	code: string;
	lang: StringLiteralUnion<string>;
	className?: string;
	hideCopy?: boolean;
}) {
	const [_highlighter, setHighlighter] = React.useState<
		HighlighterCore | undefined
	>(highlighter);

	useEffect(() => {
		if (!highlighter) getHighlighter().then(setHighlighter);
	}, []);

	const { codeLines, code } = useMemo(() => {
		if (!props.code)
			return {
				code: undefined,
				codeLines: 0,
			};

		const trim = props.code.trim();
		const codeLines = trim.split("\n").length;

		if (!_highlighter) {
			return {
				code: undefined,
				codeLines,
			};
		}

		const code = _highlighter.codeToHtml(trim, {
			lang: props.lang,
			theme: "min-light",
		});

		return {
			code,
			codeLines,
		};
	}, [props.code, _highlighter]);

	const skeletonHeight = codeLines * 1.5 + 2; // Adjust the multiplier based on your design needs

	return (
		<ScrollArea className="rounded-lg relative w-full text-sm group transition-height">
			{!code && (
				<Skeleton
					className="w-full"
					style={{ height: `${skeletonHeight}rem` }}
				/>
			)}

			{code && (
				<>
					<p
						className={`[&>pre]:!bg-gray-100 [&>pre]:p-4 rounded-lg max-h-96 overflow-visible min-w-full w-fit ${props.className}`}
						style={{
							overflowWrap: "break-word",
						}}
						dangerouslySetInnerHTML={{
							__html: code,
						}}
					/>
					{!props.hideCopy && (
						<CopyButton
							className="transition-opacity opacity-0 group-hover:opacity-100 absolute right-2 top-2"
							text={props.code}
						/>
					)}
				</>
			)}
		</ScrollArea>
	);
}

export function generateDockerCommandsForCustomNode({
  custom_node: { pip, url, hash, install_type, files },
  path: customNodePath = "/comfyui/custom_nodes",
}: {
  custom_node: any;
  path?: string;
}) {
  const commands: string[] = [];
  // commands.push(`FROM base`);
  commands.push(`WORKDIR ${customNodePath}`);
  if (pip) {
    commands.push(`RUN python -m pip install ${pip.join(" ")}`);
  }

  if (install_type === "git-clone") {
    commands.push(`RUN git clone ${url} --recursive`);
    const folderName = url.split("/").pop()?.replace(".git", "");
    commands.push(`WORKDIR ${customNodePath}/${folderName}`);
    if (hash) {
      commands.push(`RUN git reset --hard ${hash}`);
    }
    // Check for a requirements.txt file and install if present
    commands.push(
      "RUN if [ -f requirements.txt ]; then python -m pip install -r requirements.txt; fi",
    );
    // Check for an install.py script and execute if present
    commands.push(
      `RUN if [ -f install.py ]; then python install.py || echo "install script failed"; fi`,
    );
    // commands.push(`RUN if [ -f install.py ]; then python install.py; fi`);
  } else if (install_type === "copy") {
    files?.forEach((fileUrl) => {
      // const targetPath = customNodePath; // Default to customNodePath
      if (fileUrl.endsWith("/")) {
        fileUrl = fileUrl.slice(0, -1); // Remove trailing slash
      }
      // Ignoring js files for now
      if (fileUrl.endsWith(".py")) {
        // Python file, download directly to customNodePath
        commands.push(`RUN wget ${fileUrl} -P .`);
      }
    });
  }

  return commands;
}

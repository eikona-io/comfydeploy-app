export function BlueprintOutline() {
  const dotH =
    'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 4%22%3E%3Crect width=%222%22 height=%222%22 fill=%22%23212126%22/%3E%3C/svg%3E")';
  const dotV =
    'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 4 1%22%3E%3Crect width=%222%22 height=%222%22 fill=%22%23212126%22/%3E%3C/svg%3E")';
  const mask =
    "linear-gradient(to bottom, transparent, white 7rem, white calc(100% - 7rem), transparent)";
  const maskV =
    "linear-gradient(to right, transparent, white 7rem, white calc(100% - 7rem), transparent)";

  return (
    <>
      <div
        className="-right-px absolute inset-y-0 w-px opacity-30"
        style={{
          backgroundImage: dotH,
          WebkitMaskImage: mask,
          maskImage: mask,
          marginTop: "-2rem",
          marginBottom: "-1rem",
        }}
      />
      <div
        className="-left-px absolute inset-y-0 w-px opacity-30"
        style={{
          backgroundImage: dotH,
          WebkitMaskImage: mask,
          maskImage: mask,
          marginTop: "-2rem",
          marginBottom: "-1rem",
        }}
      />

      <div
        className="-top-px absolute inset-x-0 h-px opacity-30"
        style={{
          backgroundImage: dotV,
          WebkitMaskImage: maskV,
          maskImage: maskV,

          marginLeft: "-2.25rem",
          marginRight: "-3rem",
        }}
      />

      <div
        className="-bottom-px absolute inset-x-0 h-px opacity-30"
        style={{
          backgroundImage: dotV,
          WebkitMaskImage: maskV,
          maskImage: maskV,

          marginLeft: "-3rem",
          marginRight: "-2.25rem",
        }}
      />
    </>
  );
}

export function BlueprintOutlineLight() {
  const dotH =
    'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 6%22%3E%3Crect width=%224%22 height=%224%22 fill=%22%23f0f0f0%22/%3E%3C/svg%3E")';
  const dotV =
    'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 6 1%22%3E%3Crect width=%224%22 height=%224%22 fill=%22%23f0f0f0%22/%3E%3C/svg%3E")';
  const mask =
    "linear-gradient(to bottom, transparent, white 7rem, white calc(100% - 7rem), transparent)";
  const maskV =
    "linear-gradient(to right, transparent, white 7rem, white calc(100% - 7rem), transparent)";

  return (
    <>
      <div
        className="-right-1 absolute inset-y-0 w-px opacity-30"
        style={{
          backgroundImage: dotH,
          WebkitMaskImage: mask,
          maskImage: mask,
          marginTop: "-2rem",
          marginBottom: "-3rem",
        }}
      />
      <div
        className="-left-1 absolute inset-y-0 w-px opacity-30"
        style={{
          backgroundImage: dotH,
          WebkitMaskImage: mask,
          maskImage: mask,
          marginTop: "-3rem",
          marginBottom: "-2.25rem",
        }}
      />

      <div
        className="-top-1 absolute inset-x-0 h-px opacity-30"
        style={{
          backgroundImage: dotV,
          WebkitMaskImage: maskV,
          maskImage: maskV,

          marginLeft: "-2.25rem",
          marginRight: "-3rem",
        }}
      />

      <div
        className="-bottom-1 absolute inset-x-0 h-px opacity-30"
        style={{
          backgroundImage: dotV,
          WebkitMaskImage: maskV,
          maskImage: maskV,

          marginLeft: "-3rem",
          marginRight: "-2.25rem",
        }}
      />
    </>
  );
}

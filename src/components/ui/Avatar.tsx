import React, {
  HTMLAttributes,
  useEffect,
  useState,
} from "react";

export type AvatarSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

export type AvatarStatus =
  | "online"
  | "offline"
  | "busy"
  | "away";

const AVATAR_COLORS = [
  "avatar-color-blue",
  "avatar-color-green",
  "avatar-color-purple",
  "avatar-color-pink",
  "avatar-color-orange",
  "avatar-color-cyan",
  "avatar-color-yellow",
  "avatar-color-red",
];

export type AvatarColor =
  (typeof AVATAR_COLORS)[number];

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "avatar-xs",
  sm: "avatar-sm",
  md: "avatar-md",
  lg: "avatar-lg",
  xl: "avatar-xl",
};

const STATUS_CLASSES: Record<
  AvatarStatus,
  string
> = {
  online: "avatar-status-online",
  offline: "avatar-status-offline",
  busy: "avatar-status-busy",
  away: "avatar-status-away",
};

function getInitials(name?: string): string {
  if (!name?.trim()) {
    return "?";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  const first = parts[0]?.[0] ?? "";
  const last =
    parts[parts.length - 1]?.[0] ?? "";

  return `${first}${last}`.toUpperCase();
}


function getRandomColor(): AvatarColor {
  const index = Math.floor(
    Math.random() * AVATAR_COLORS.length
  );

  return AVATAR_COLORS[index];
}

export interface AvatarProps
  extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  showTooltip?: boolean;
}

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  status,
  showTooltip = true,
  className = "",
  ...props
}: AvatarProps) {
  const [imageError, setImageError] =
    useState(false);

  const [avatarColor] =
    useState<AvatarColor>(() =>
      getRandomColor()
    );

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const showImage =
    Boolean(src) && !imageError;

  const avatarClasses = [
    "avatar",
    SIZE_CLASSES[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const innerClasses = [
    "avatar-inner",
    !showImage && avatarColor,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={avatarClasses}
      {...props}
    >
      <span className={innerClasses}>
        {showImage ? (
          <img
            src={src}
            alt={
              alt ??
              name ??
              "Avatar"
            }
            className="avatar-image"
            onError={() =>
              setImageError(true)
            }
          />
        ) : (
          <span className="avatar-fallback">
            {getInitials(name)}
          </span>
        )}
      </span>

      {status && (
        <span
          className={[
            "avatar-status",
            STATUS_CLASSES[status],
          ].join(" ")}
          role="status"
          aria-label={`Status: ${status}`}
        />
      )}

      {showTooltip && name && (
        <span className="avatar-tooltip">
          {name}
        </span>
      )}
    </span>
  );
}


export interface AvatarGroupItem {
  id: string | number;
  src?: string;
  alt?: string;
  name?: string;
  status?: AvatarStatus;
}

export interface AvatarGroupProps
  extends HTMLAttributes<HTMLDivElement> {
  avatars: AvatarGroupItem[];
  size?: AvatarSize;
  max?: number;
}

export function AvatarGroup({
  avatars,
  size = "md",
  max = 4,
  className = "",
  ...props
}: AvatarGroupProps) {
  const visibleAvatars =
    avatars.slice(0, max);

  const overflowAvatars =
    avatars.slice(max);

  const groupClasses = [
    "avatar-group",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={groupClasses}
      {...props}
    >

      {visibleAvatars.map((avatar) => (
        <Avatar
          key={avatar.id}
          src={avatar.src}
          alt={avatar.alt}
          name={avatar.name}
          status={avatar.status}
          size={size}
        />
      ))}

      {overflowAvatars.length > 0 && (
        <span
          className={[
            "avatar",
            SIZE_CLASSES[size],
            "avatar-overflow",
          ].join(" ")}
          aria-label={`${overflowAvatars.length} more users`}
        >
          <span className="avatar-inner avatar-color-neutral">
            <span className="avatar-fallback">
              +{overflowAvatars.length}
            </span>
          </span>
          <span className="avatar-overflow-tooltip">
            <span className="avatar-overflow-group">

              {overflowAvatars.map(
                (avatar) => (
                  <Avatar
                    key={avatar.id}
                    src={avatar.src}
                    alt={avatar.alt}
                    name={avatar.name}
                    status={avatar.status}
                    size={size}
                    showTooltip
                  />
                )
              )}

            </span>
          </span>
        </span>
      )}
    </div>
  );
}
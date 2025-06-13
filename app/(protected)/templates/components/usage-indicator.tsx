interface UsageIndicatorProps {
  current: number;
  limit: number;
  remaining: number;
}

export function UsageIndicator({
  current,
  limit,
  remaining,
}: UsageIndicatorProps) {
  const percentage = limit === -1 ? 0 : (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= limit;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Templates Used</span>
        <span
          className={`font-medium ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}`}
        >
          {current} / {limit === -1 ? '∞' : limit}
        </span>
      </div>
      {limit !== -1 && (
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isAtLimit
                ? 'bg-red-500'
                : isNearLimit
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
      {remaining <= 1 && limit !== -1 && (
        <p className="text-muted-foreground text-xs">
          {remaining === 0
            ? 'Template limit reached'
            : `${remaining} template${remaining !== 1 ? 's' : ''} remaining`}
        </p>
      )}
    </div>
  );
}

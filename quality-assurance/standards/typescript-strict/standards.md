# 📝 TypeScript 严格模式质量标准

## 概述

本文档定义了 Xorigo UI 项目中 TypeScript 严格模式的质量标准和实施规范。

## 严格模式配置

### 必须启用的严格选项

```json
{
  "compilerOptions": {
    // 基础严格模式
    "strict": true,

    // 具体严格选项
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,

    // 额外严格检查
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,

    // 错误处理
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false
  }
}
```

### 禁用或限制的选项

```json
{
  "compilerOptions": {
    // 禁用宽松类型
    "suppressImplicitAnyIndexErrors": false,

    // 禁用类型断言的过度使用
    "noImplicitAny": true,

    // 禁用 this 的隐式 any
    "noImplicitThis": true,

    // 禁用 unknown 类型的隐式使用
    "strictNullChecks": true
  }
}
```

## 质量指标和阈值

### 类型安全指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 类型覆盖率 | ≥ 95% | 所有公共 API 必须有类型定义 |
| Implicit Any 错误 | 0 | 不允许任何 implicit any |
| Unknown 类型处理 | 100% | 所有 unknown 必须类型收窄 |
| 类型断言使用率 | ≤ 0.1% | 尽量避免类型断言 |
| 可选属性使用率 | ≤ 20% | 明确需要的属性才可选 |

### 代码复杂度指标

| 指标 | 阈值 | 说明 |
|------|------|------|
| 函数复杂度 | ≤ 10 | 圈复杂度 |
| 嵌套深度 | ≤ 4 | 代码嵌套层级 |
| 函数长度 | ≤ 50 行 | 单个函数 |
| 文件长度 | ≤ 300 行 | 单个文件 |
| 接口属性数量 | ≤ 20 | 单个接口 |

## 类型定义标准

### 接口定义规范

```typescript
// ✅ 好的实践
interface ComponentProps {
  // 必需属性在前
  children: React.ReactNode;
  onSubmit: (data: FormData) => void;

  // 可选属性在后，使用明确的可选语法
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';

  // 明确的只读属性
  readonly id: string;
  readonly type: 'button' | 'submit';

  // 泛型约束
  disabled?: boolean;
  'aria-label'?: string;
}

// ❌ 避免的实践
interface BadComponentProps {
  any?: any; // 禁用 any 类型
  [key: string]: unknown; // 过度宽松的索引签名
  optional?: string; // 不明确的可选性
}
```

### 函数类型定义

```typescript
// ✅ 明确的函数类型
type EventHandler<T = Event> = (event: T) => void;
type AsyncDataFetcher<T> = (params: RequestParams) => Promise<T>;
type Validator<T> = (value: unknown) => value is T;

// ✅ 泛型约束
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// ❌ 避免的实践
type BadFunction = (data: any) => any; // 过于宽松
type BadAsync = (params) => Promise; // 缺少类型
```

### 联合类型和交叉类型

```typescript
// ✅ 明确的联合类型
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ThemeMode = 'light' | 'dark' | 'auto';

// ✅ 字面量类型优先
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Color = `#${string}` | 'red' | 'green' | 'blue';

// ✅ 有意义的交叉类型
type BaseComponent = {
  id: string;
  className?: string;
};

type ClickableComponent = BaseComponent & {
  onClick: (event: MouseEvent) => void;
};

// ❌ 避免过度复杂的联合类型
type BadUnion = string | number | boolean | object | Array<any>;
```

## 错误处理标准

### 明确的错误类型

```typescript
// ✅ 定义明确的错误类型
interface ValidationError {
  code: 'VALIDATION_ERROR';
  field: string;
  message: string;
  value: unknown;
}

interface NetworkError {
  code: 'NETWORK_ERROR';
  status: number;
  message: string;
}

type AppError = ValidationError | NetworkError;

// ✅ 类型收窄的错误处理
function handleError(error: AppError): void {
  if (error.code === 'VALIDATION_ERROR') {
    console.log(`Validation failed for ${error.field}: ${error.message}`);
  } else if (error.code === 'NETWORK_ERROR') {
    console.log(`Network error ${error.status}: ${error.message}`);
  }
}

// ❌ 避免的错误处理
function badHandleError(error: any): void {
  console.log(error); // 类型丢失
}
```

### Result 模式实现

```typescript
// ✅ Result 类型定义
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// ✅ 类型守卫
function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success;
}

function isError<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}

// ✅ 使用示例
function parseJSON(text: string): Result<unknown, SyntaxError> {
  try {
    return { success: true, data: JSON.parse(text) };
  } catch (error) {
    return { success: false, error: error as SyntaxError };
  }
}
```

## 组件类型标准

### React 组件类型

```typescript
// ✅ 标准组件类型
interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: Size;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

// ✅ 使用 forwardRef 的类型
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', disabled = false, onClick, className }, ref) => {
    return (
      <button
        ref={ref}
        className={className}
        disabled={disabled}
        onClick={onClick}
        data-variant={variant}
        data-size={size}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ✅ 泛型组件类型
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyState?: React.ReactNode;
}

function List<T>({ items, renderItem, keyExtractor, emptyState }: ListProps<T>) {
  if (items.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}
```

### Hook 类型标准

```typescript
// ✅ 标准 Hook 类型
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// ✅ 自定义 Hook 返回类型
interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useAsync<T>(asyncFn: () => Promise<T>): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
```

## 验证和检查

### ESLint 规则配置

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/prefer-readonly-parameter-types": "warn"
  }
}
```

### 类型检查脚本

```typescript
// scripts/type-check.ts
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface TypeCheckResult {
  success: boolean;
  errors: number;
  warnings: number;
  implicitAny: number;
  unknownTypes: number;
}

function runTypeCheck(): TypeCheckResult {
  try {
    const output = execSync('npx tsc --noEmit --pretty false', {
      encoding: 'utf8',
      stdio: 'pipe'
    });

    return {
      success: true,
      errors: 0,
      warnings: 0,
      implicitAny: 0,
      unknownTypes: 0
    };
  } catch (error: any) {
    const output = error.stdout || error.stderr || '';

    return {
      success: false,
      errors: (output.match(/error TS/g) || []).length,
      warnings: (output.match(/warning TS/g) || []).length,
      implicitAny: (output.match(/implicitly has type 'any'/g) || []).length,
      unknownTypes: (output.match(/has type 'unknown'/g) || []).length
    };
  }
}

function validateTypeQuality(result: TypeCheckResult): boolean {
  if (!result.success) {
    console.error('❌ TypeScript compilation failed');
    return false;
  }

  if (result.errors > 0) {
    console.error(`❌ Found ${result.errors} TypeScript errors`);
    return false;
  }

  if (result.implicitAny > 0) {
    console.error(`❌ Found ${result.implicitAny} implicit any types`);
    return false;
  }

  if (result.unknownTypes > 10) {
    console.warn(`⚠️ Found ${result.unknownTypes} unknown types (should be typed more specifically)`);
  }

  console.log('✅ TypeScript quality check passed');
  return true;
}

// 运行检查
const result = runTypeCheck();
const isValid = validateTypeQuality(result);

if (!isValid) {
  process.exit(1);
}
```

## 实施计划

### Phase 1: 基础严格模式 (Week 1)
- [ ] 启用所有基础严格选项
- [ ] 修复现有 implicit any 错误
- [ ] 配置 ESLint TypeScript 规则

### Phase 2: 高级类型安全 (Week 2)
- [ ] 启用 `noUncheckedIndexedAccess`
- [ ] 启用 `exactOptionalPropertyTypes`
- [ ] 实施类型守卫和收窄

### Phase 3: 质量指标监控 (Week 3)
- [ ] 建立类型覆盖率检查
- [ ] 配置 CI/CD 类型检查门禁
- [ ] 实施自动化类型质量报告

### Phase 4: 持续改进 (Week 4+)
- [ ] 定期审查类型定义
- [ ] 优化复杂类型结构
- [ ] 建立类型最佳实践文档

---

通过实施这些 TypeScript 严格模式标准，我们将显著提高代码质量、减少运行时错误，并提供更好的开发体验。
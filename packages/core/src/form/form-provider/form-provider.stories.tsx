import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FormProvider, useForm } from './form-provider'

const meta = {
  title: 'Forms/FormProvider',
  component: FormProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FormProvider 是一个表单上下文提供者组件，提供完整的表单状态管理、验证和处理功能。它可以作为独立的上下文提供者使用，也可以与 Form 组件配合使用。',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '禁用整个表单',
    },
    readonly: {
      control: 'boolean',
      description: '只读模式',
    },
    validateOnChange: {
      control: 'boolean',
      description: '值变化时是否自动验证',
    },
    validateOnBlur: {
      control: 'boolean',
      description: '失焦时是否自动验证',
    },
    enableReinitialize: {
      control: 'boolean',
      description: '初始值变化时是否重新初始化',
    },
  },
} satisfies Meta<typeof FormProvider>

export default meta
type Story = StoryObj<typeof meta>

// ==============================
// 基本用法
// ==============================

export const BasicUsage: Story = {
  args: {
    initialValues: {
      name: '',
      email: '',
    },
  },
  render: (args) => {
    return (
      <div className="w-[500px] p-6 border rounded-lg">
        <FormProvider {...args}>
          <BasicForm />
        </FormProvider>
      </div>
    )
  },
}

// ==============================
// 基础表单组件
// ==============================

const BasicForm = () => {
  const { values, setFieldValue, handleSubmit } = useForm()
  const [submitted, setSubmitted] = useState<string | null>(null)

  const onSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟异步
    setSubmitted(JSON.stringify(data, null, 2))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          value={values.name || ''}
          onChange={(e) => setFieldValue('name', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          value={values.email || ''}
          onChange={(e) => setFieldValue('email', e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>

      {submitted && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-medium text-green-800 mb-1">Submitted:</p>
          <pre className="text-xs text-green-700 overflow-auto">{submitted}</pre>
        </div>
      )}
    </form>
  )
}

// ==============================
// 带验证的表单
// ==============================

export const WithValidation: Story = {
  args: {
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validateOnChange: true,
    validateOnBlur: true,
  },
  render: (args) => {
    return (
      <div className="w-[500px] p-6 border rounded-lg">
        <FormProvider {...args}>
          <ValidationForm />
        </FormProvider>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '此示例展示了如何使用自定义验证函数验证表单字段。验证会在值变化和失焦时触发。',
      },
    },
  },
}

const ValidationForm = () => {
  const { values, errors, touched, setFieldValue, validateForm, handleSubmit } = useForm()
  const [submitted, setSubmitted] = useState<string | null>(null)

  const validate = (values: any) => {
    const errors: any = {}

    if (!values.username) {
      errors.username = 'Username is required'
    } else if (values.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }

    if (!values.password) {
      errors.password = 'Password is required'
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    return errors
  }

  const onSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    setSubmitted(JSON.stringify(data, null, 2))
  }

  // 使用自定义验证
  const onValidateAndSubmit = () => {
    validateForm().then((isValid) => {
      if (isValid) {
        handleSubmit(onSubmit)()
      }
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.username && touched.username ? 'border-red-500' : 'border-gray-300'
          }`}
          value={values.username || ''}
          onChange={(e) => setFieldValue('username', e.target.value)}
          onBlur={() => setFieldValue('username', values.username)}
        />
        {errors.username && touched.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
          }`}
          value={values.password || ''}
          onChange={(e) => setFieldValue('password', e.target.value)}
        />
        {errors.password && touched.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          value={values.confirmPassword || ''}
          onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
        />
        {errors.confirmPassword && touched.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onValidateAndSubmit}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>

      {submitted && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-medium text-green-800 mb-1">Submitted:</p>
          <pre className="text-xs text-green-700 overflow-auto">{submitted}</pre>
        </div>
      )}
    </div>
  )
}

// ==============================
// 禁用状态
// ==============================

export const DisabledState: Story = {
  args: {
    initialValues: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    disabled: true,
  },
  render: (args) => {
    return (
      <div className="w-[500px] p-6 border rounded-lg">
        <FormProvider {...args}>
          <DisabledForm />
        </FormProvider>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '表单在禁用状态下无法编辑和提交。',
      },
    },
  },
}

const DisabledForm = () => {
  const { values, setFieldValue, handleSubmit, isSubmitting } = useForm()

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-4">
      <div>
        <label htmlFor="disabled-name" className="block text-sm font-medium mb-1">
          Name (Disabled)
        </label>
        <input
          id="disabled-name"
          type="text"
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          value={values.name || ''}
          onChange={(e) => setFieldValue('name', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="disabled-email" className="block text-sm font-medium mb-1">
          Email (Disabled)
        </label>
        <input
          id="disabled-email"
          type="email"
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          value={values.email || ''}
          onChange={(e) => setFieldValue('email', e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled
        className="w-full bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed"
      >
        Submit
      </button>
    </form>
  )
}

// ==============================
// 只读状态
// ==============================

export const ReadonlyState: Story = {
  args: {
    initialValues: {
      name: 'Jane Doe',
      email: 'jane@example.com',
    },
    readonly: true,
  },
  render: (args) => {
    return (
      <div className="w-[500px] p-6 border rounded-lg">
        <FormProvider {...args}>
          <ReadonlyForm />
        </FormProvider>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '表单在只读模式下字段值可见但不可编辑。',
      },
    },
  },
}

const ReadonlyForm = () => {
  const { values, setFieldValue, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-4">
      <div>
        <label htmlFor="readonly-name" className="block text-sm font-medium mb-1">
          Name (Readonly)
        </label>
        <input
          id="readonly-name"
          type="text"
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          value={values.name || ''}
          onChange={(e) => setFieldValue('name', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="readonly-email" className="block text-sm font-medium mb-1">
          Email (Readonly)
        </label>
        <input
          id="readonly-email"
          type="email"
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          value={values.email || ''}
          onChange={(e) => setFieldValue('email', e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  )
}

// ==============================
// 嵌套表单
// ==============================

export const NestedForms: Story = {
  args: {
    initialValues: {
      user: {
        firstName: '',
        lastName: '',
        email: '',
      },
    },
  },
  render: (args) => {
    return (
      <div className="w-[500px] p-6 border rounded-lg">
        <FormProvider {...args}>
          <NestedForm />
        </FormProvider>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'FormProvider 支持嵌套对象和数组值，便于管理复杂的数据结构。',
      },
    },
  },
}

const NestedForm = () => {
  const { values, errors, setFieldValue, handleSubmit } = useForm()
  const [submitted, setSubmitted] = useState<string | null>(null)

  const onSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    setSubmitted(JSON.stringify(data, null, 2))
  }

  return (
    <div className="space-y-4">
      <fieldset className="border border-gray-300 rounded-md p-4">
        <legend className="text-sm font-medium px-2">User Information</legend>

        <div className="space-y-3">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={values.user?.firstName || ''}
              onChange={(e) => setFieldValue('user.firstName', e.target.value)}
            />
            {errors.user?.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.user.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={values.user?.lastName || ''}
              onChange={(e) => setFieldValue('user.lastName', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="userEmail"
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              value={values.user?.email || ''}
              onChange={(e) => setFieldValue('user.email', e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>

      {submitted && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-medium text-green-800 mb-1">Submitted:</p>
          <pre className="text-xs text-green-700 overflow-auto">{submitted}</pre>
        </div>
      )}
    </div>
  )
}

// ==============================
// 动态字段
// ==============================

export const DynamicFields: Story = {
  args: {
    initialValues: {
      items: [
        { id: 1, name: '', quantity: 1 },
      ],
    },
  },
  render: (args) => {
    return (
      <div className="w-[600px] p-6 border rounded-lg">
        <FormProvider {...args}>
          <DynamicFieldsForm />
        </FormProvider>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '此示例展示了如何动态添加和删除表单字段。',
      },
    },
  },
}

const DynamicFieldsForm = () => {
  const { values, setFieldValue, handleSubmit } = useForm()
  const [submitted, setSubmitted] = useState<string | null>(null)

  const addItem = () => {
    const newId = Date.now()
    const currentItems = values.items || []
    setFieldValue('items', [...currentItems, { id: newId, name: '', quantity: 1 }])
  }

  const removeItem = (id: number) => {
    const currentItems = values.items || []
    setFieldValue('items', currentItems.filter((item: any) => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: any) => {
    const currentItems = values.items || []
    setFieldValue(
      'items',
      currentItems.map((item: any) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const onSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    setSubmitted(JSON.stringify(data, null, 2))
  }

  const items = values.items || []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Items</h3>
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
        >
          Add Item
        </button>
      </div>

      {items.map((item: any, index: number) => (
        <div key={item.id} className="flex gap-2 items-end border border-gray-300 rounded-md p-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Item {index + 1} Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={item.name}
              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
            />
          </div>

          <div className="w-24">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border rounded-md"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
            />
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            disabled={items.length === 1}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>

      {submitted && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-medium text-green-800 mb-1">Submitted:</p>
          <pre className="text-xs text-green-700 overflow-auto">{submitted}</pre>
        </div>
      )}
    </div>
  )
}

// ==============================
// 复杂验证示例
// ==============================

export const ComplexValidation: Story = {
  args: {
    initialValues: {
      email: '',
      confirmEmail: '',
      age: '',
    },
    validateOnChange: true,
  },
  render: (args) => {
    return (
      <div className="w-[500px] p-6 border rounded-lg">
        <FormProvider {...args}>
          <ComplexValidationForm />
        </FormProvider>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '此示例展示了复杂的验证逻辑，包括异步验证和跨字段验证。',
      },
    },
  },
}

const ComplexValidationForm = () => {
  const { values, errors, touched, setFieldValue, setFieldValidating, validateField, handleSubmit } = useForm()
  const [submitted, setSubmitted] = useState<string | null>(null)

  // 异步邮箱验证
  const validateEmailAsync = async (email: string) => {
    setFieldValidating('email', true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟 API 调用
    setFieldValidating('email', false)

    // 模拟验证失败
    if (email === 'taken@example.com') {
      return 'This email is already taken'
    }
    return undefined
  }

  const onEmailChange = (email: string) => {
    setFieldValue('email', email)
    validateEmailAsync(email)
  }

  const validate = (values: any) => {
    const errors: any = {}

    if (!values.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid'
    }

    if (!values.confirmEmail) {
      errors.confirmEmail = 'Please confirm your email'
    } else if (values.email !== values.confirmEmail) {
      errors.confirmEmail = 'Emails do not match'
    }

    if (!values.age) {
      errors.age = 'Age is required'
    } else if (isNaN(Number(values.age))) {
      errors.age = 'Age must be a number'
    } else if (Number(values.age) < 18) {
      errors.age = 'You must be at least 18 years old'
    } else if (Number(values.age) > 120) {
      errors.age = 'Invalid age'
    }

    return errors
  }

  const onSubmit = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    setSubmitted(JSON.stringify(data, null, 2))
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="complex-email" className="block text-sm font-medium mb-1">
          Email
          {values.email && (
            <span className="ml-2 text-xs text-gray-500">
              {values.validating?.email ? '(Checking...)' : ''}
            </span>
          )}
        </label>
        <input
          id="complex-email"
          type="email"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
          }`}
          value={values.email || ''}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        {errors.email && touched.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmEmail" className="block text-sm font-medium mb-1">
          Confirm Email
        </label>
        <input
          id="confirmEmail"
          type="email"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.confirmEmail && touched.confirmEmail ? 'border-red-500' : 'border-gray-300'
          }`}
          value={values.confirmEmail || ''}
          onChange={(e) => setFieldValue('confirmEmail', e.target.value)}
        />
        {errors.confirmEmail && touched.confirmEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmEmail}</p>
        )}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium mb-1">
          Age
        </label>
        <input
          id="age"
          type="number"
          min="1"
          max="120"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.age && touched.age ? 'border-red-500' : 'border-gray-300'
          }`}
          value={values.age || ''}
          onChange={(e) => setFieldValue('age', e.target.value)}
        />
        {errors.age && touched.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={Object.keys(errors).length > 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Submit
      </button>

      {submitted && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm font-medium text-green-800 mb-1">Submitted:</p>
          <pre className="text-xs text-green-700 overflow-auto">{submitted}</pre>
        </div>
      )}
    </div>
  )
}

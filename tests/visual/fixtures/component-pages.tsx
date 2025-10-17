import React from 'react';
import { Button } from '@xorigo-ui/core';
import { Card, CardContent, CardHeader, CardTitle } from '@xorigo-ui/core';
import { Input } from '@xorigo-ui/core';
import { Alert } from '@xorigo-ui/core';
import { Badge } from '@xorigo-ui/core';
import { Avatar } from '@xorigo-ui/core';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@xorigo-ui/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@xorigo-ui/core';
import { Switch } from '@xorigo-ui/core';
import { Checkbox } from '@xorigo-ui/core';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@xorigo-ui/core';

/**
 * 测试页面组件 - 提供所有组件的测试环境
 */
export const ComponentTestPage: React.FC<{ theme?: string }> = ({ theme = 'default' }) => {
  return (
    <div data-theme={theme} className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Button组件测试区域 */}
        <section data-testid="button-section">
          <h2 className="text-2xl font-bold mb-6">Button Components</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button data-testid="button-primary" variant="primary">Primary</Button>
            <Button data-testid="button-secondary" variant="secondary">Secondary</Button>
            <Button data-testid="button-outline" variant="outline">Outline</Button>
            <Button data-testid="button-ghost" variant="ghost">Ghost</Button>
            <Button data-testid="button-sm" size="sm">Small</Button>
            <Button data-testid="button-md" size="md">Medium</Button>
            <Button data-testid="button-lg" size="lg">Large</Button>
            <Button data-testid="button-disabled" disabled>Disabled</Button>
          </div>
        </section>

        {/* Input组件测试区域 */}
        <section data-testid="input-section">
          <h2 className="text-2xl font-bold mb-6">Input Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              data-testid="input-default"
              placeholder="Default input"
            />
            <Input
              data-testid="input-value"
              defaultValue="With value"
            />
            <Input
              data-testid="input-disabled"
              disabled
              placeholder="Disabled input"
            />
            <Input
              data-testid="input-error"
              defaultValue="Error state"
              className="border-red-500"
            />
          </div>
        </section>

        {/* Card组件测试区域 */}
        <section data-testid="card-section">
          <h2 className="text-2xl font-bold mb-6">Card Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card data-testid="card-default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This is a default card with title and content.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-hover" className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle>Hover Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card has hover effects with shadow changes.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-selected" className="ring-2 ring-primary">
              <CardHeader>
                <CardTitle>Selected Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This card shows a selected state with ring.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Alert组件测试区域 */}
        <section data-testid="alert-section">
          <h2 className="text-2xl font-bold mb-6">Alert Components</h2>
          <div className="space-y-4">
            <Alert data-testid="alert-info">
              This is an informational alert message.
            </Alert>
            <Alert data-testid="alert-success" variant="success">
              Success! Your changes have been saved.
            </Alert>
            <Alert data-testid="alert-warning" variant="warning">
              Warning: Please review your input.
            </Alert>
            <Alert data-testid="alert-error" variant="error">
              Error: Something went wrong. Please try again.
            </Alert>
          </div>
        </section>

        {/* Badge组件测试区域 */}
        <section data-testid="badge-section">
          <h2 className="text-2xl font-bold mb-6">Badge Components</h2>
          <div className="flex flex-wrap gap-2">
            <Badge data-testid="badge-default">Default</Badge>
            <Badge data-testid="badge-primary" variant="primary">Primary</Badge>
            <Badge data-testid="badge-secondary" variant="secondary">Secondary</Badge>
            <Badge data-testid="badge-success" variant="success">Success</Badge>
            <Badge data-testid="badge-warning" variant="warning">Warning</Badge>
            <Badge data-testid="badge-error" variant="error">Error</Badge>
          </div>
        </section>

        {/* Avatar组件测试区域 */}
        <section data-testid="avatar-section">
          <h2 className="text-2xl font-bold mb-6">Avatar Components</h2>
          <div className="flex items-center gap-4">
            <Avatar data-testid="avatar-default">
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                JD
              </div>
            </Avatar>
            <Avatar data-testid="avatar-sm" size="sm">
              <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-secondary font-semibold">
                AB
              </div>
            </Avatar>
            <Avatar data-testid="avatar-lg" size="lg">
              <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                CD
              </div>
            </Avatar>
          </div>
        </section>

        {/* Form组件测试区域 */}
        <section data-testid="form-section">
          <h2 className="text-2xl font-bold mb-6">Form Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch data-testid="switch-default" />
                <label htmlFor="switch-default">Default Switch</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch data-testid="switch-checked" defaultChecked />
                <label htmlFor="switch-checked">Checked Switch</label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch data-testid="switch-disabled" disabled />
                <label htmlFor="switch-disabled">Disabled Switch</label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox data-testid="checkbox-default" />
                <label>Default Checkbox</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox data-testid="checkbox-checked" defaultChecked />
                <label>Checked Checkbox</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox data-testid="checkbox-disabled" disabled />
                <label>Disabled Checkbox</label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Select data-testid="select-default">
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Tabs组件测试区域 */}
        <section data-testid="tabs-section">
          <h2 className="text-2xl font-bold mb-6">Tabs Components</h2>
          <Tabs defaultValue="tab1" data-testid="tabs-default">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p>Content for Tab 1</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <p>Content for Tab 2</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <p>Content for Tab 3</p>
            </TabsContent>
          </Tabs>
        </section>

        {/* Modal组件测试区域 */}
        <section data-testid="modal-section">
          <h2 className="text-2xl font-bold mb-6">Modal Components</h2>
          <Modal>
            <ModalTrigger asChild>
              <Button data-testid="modal-trigger">Open Modal</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Test Modal</ModalTitle>
              </ModalHeader>
              <div className="p-6">
                <p>This is a test modal content for visual regression testing.</p>
              </div>
            </ModalContent>
          </Modal>
        </section>

      </div>
    </div>
  );
};

/**
 * 响应式测试页面
 */
export const ResponsiveTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          响应式设计测试
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} data-testid={`responsive-card-${i}`}>
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base">
                  This card adapts to different screen sizes. On mobile it takes full width,
                  on tablet it shows 2 columns, and on desktop it shows 3 columns.
                </p>
                <Button className="mt-4 w-full md:w-auto">Action {i}</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Button className="flex-1">Full Width Mobile</Button>
          <Button className="flex-1">Side by Side Desktop</Button>
        </div>
      </div>
    </div>
  );
};
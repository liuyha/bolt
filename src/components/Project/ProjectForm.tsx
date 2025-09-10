import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

interface ProjectFormData {
  name: string;
  description?: string;
  state: string;
  belongRole: string;
  administrators: string;
  memberTotal: number;
}

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  title: string;
  initialData?: Partial<ProjectFormData>;
}

export function ProjectForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  initialData 
}: ProjectFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      form.setFieldsValue(initialData);
    } else if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onSubmit({
        ...values,
        memberTotal: values.memberTotal || 1
      });
      form.resetFields();
      message.success(initialData ? '项目更新成功' : '项目创建成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          state: 'active',
          belongRole: 'owner',
          memberTotal: 1
        }}
      >
        <Form.Item
          name="name"
          label="项目名称"
          rules={[
            { required: true, message: '请输入项目名称' },
            { max: 50, message: '项目名称不能超过50个字符' }
          ]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="项目描述"
          rules={[
            { max: 200, message: '项目描述不能超过200个字符' }
          ]}
        >
          <TextArea 
            rows={3} 
            placeholder="请输入项目描述（可选）" 
            showCount 
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          name="state"
          label="项目状态"
          rules={[{ required: true, message: '请选择项目状态' }]}
        >
          <Select placeholder="请选择项目状态">
            <Option value="active">活跃</Option>
            <Option value="inactive">暂停</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="belongRole"
          label="您的角色"
          rules={[{ required: true, message: '请选择您的角色' }]}
        >
          <Select placeholder="请选择您的角色">
            <Option value="owner">项目所有者</Option>
            <Option value="admin">管理员</Option>
            <Option value="member">成员</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="administrators"
          label="管理员"
          rules={[
            { max: 100, message: '管理员信息不能超过100个字符' }
          ]}
        >
          <Input placeholder="请输入管理员信息（可选）" />
        </Form.Item>

        <Form.Item
          name="memberTotal"
          label="成员总数"
          rules={[
            { required: true, message: '请输入成员总数' },
            { type: 'number', min: 1, message: '成员总数至少为1' }
          ]}
        >
          <Input type="number" placeholder="请输入成员总数" min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
import { Ability } from '@casl/ability';

export default new Ability([
  {
    action: 'read',
    subject: 'Post'
  },
  {
    inverted: true,
    action: 'delete',
    subject: 'Post',
    conditions: { published: true }
  }
])
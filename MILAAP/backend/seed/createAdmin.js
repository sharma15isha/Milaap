import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import User from '../models/User.js'

dotenv.config()

async function setupAdmin() {
  await connectDB()

  const adminName = process.env.ADMIN_NAME || 'Milaap Administrator'
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@milaap.edu.in').toLowerCase().trim()
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Milaap2026'

  console.log(`Checking for admin account: ${adminEmail}...`)

  let user = await User.findOne({ email: adminEmail }).select('+password')

  if (user) {
    let updated = false
    if (user.role !== 'admin') {
      user.role = 'admin'
      updated = true
    }
    // Update password if specified
    user.password = adminPassword
    await user.save()
    console.log(`✓ Admin user "${user.name}" (${user.email}) updated with admin role and credentials.`)
  } else {
    user = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    })
    console.log(`✓ Admin user created successfully:`)
    console.log(`  Name:  ${user.name}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Role:  ${user.role}`)
  }

  console.log('\n======================================================')
  console.log('  ADMIN CREDENTIALS CONFIGURED')
  console.log('======================================================')
  console.log(`  Portal URL: http://localhost:5173/admin/login`)
  console.log(`  Email:      ${adminEmail}`)
  console.log(`  Password:   ${adminPassword}`)
  console.log('======================================================\n')

  await mongoose.connection.close()
  process.exit(0)
}

setupAdmin().catch((err) => {
  console.error('Failed to configure admin:', err)
  process.exit(1)
})

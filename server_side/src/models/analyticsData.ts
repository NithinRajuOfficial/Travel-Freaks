import mongoose from 'mongoose'

const analyticsDataSchema = new mongoose.Schema({
    date:{
        type: Date,
        default: Date.now,
      },
    dailyActiveUsers:Number,
    postsCreated:Number,
    likesReceivedForPostCreatedToday:Number,
    commentsReceivedForPostCreatedToday:Number,
    totalLikesReceivedToday:Number,
    totalCommentsReceivedToday:Number,
    totalLikesReceived:Number,
    totalCommentsReceived:Number
})

export const AnalyticsData = mongoose.model('AnalyticsData',analyticsDataSchema)
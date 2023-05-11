using System;

namespace DatingApp.API.Models
{
    public class Message
    {
        public int Id { get; set; }

        public int SenderId { get; set; }

        public User Sender { get; set; }

        public int RecipientId { get; set; }

        public User Recipient { get; set; }

        public string NoContent { get; set; }

        public bool IsRead { get; set; }

        public DateTime? DateRead { get; set; }

        public DateTime? MessageSent { get; set; }

        public bool SenderDeleted { get; set; }

        public int RecipientDeleted { get; set; }

        
    }
}